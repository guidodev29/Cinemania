import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { map, tap, finalize, catchError } from 'rxjs/operators';
import { LoaderService } from 'src/app/services/loader.service';
import { ToastrService } from 'ngx-toastr';

// Interfaz para los datos de Registro
interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Interfaz para los datos de Login
interface LoginData {
  email: string;
  password: string;
}

// Interfaz para la estructura de la sesión en la respuesta de login
interface SessionData {
  access_token: string;
  refresh_token: string;
}

// Interfaz para la información del usuario en la respuesta de login
interface UserInfo {
  sub: string;
  email: string;
  // Puedes agregar más propiedades de `userInfo` aquí si las necesitas
}

// Interfaz completa para la respuesta de login
interface LoginResponse {
  data: {
    session: SessionData;
    userInfo: UserInfo;
  };
}

// Interfaz para la información del usuario
export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  createdTimestamp: number;
  enabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/api/v1';

  // BehaviorSubject para manejar el estado de autenticación
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  // Observable público para que otros componentes puedan suscribirse
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private loaderService: LoaderService, // Inyecta el servicio del loader
    private toastr: ToastrService
  ) {}

  // Verifica si el token existe en el localStorage
  public hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Método para registrar un nuevo usuario
  // Método para registrar un nuevo usuario
  register(data: RegisterData): Observable<any> {
    const url = `${this.baseUrl}/users/create/`;
    this.loaderService.show(); // Muestra el loader

    return this.http.post(url, data).pipe(
      tap(() => {
        // Muestra la alerta de éxito si el registro fue exitoso
        this.toastr.success('Usuario creado con éxito', '¡Éxito!');
        this.router.navigate(['/login']);
      }),
      catchError((error) => {
        // Muestra la alerta de error si hubo un problema
        this.toastr.error('Hubo un problema al crear el usuario', 'Error');
        return throwError(error); // Lanza el error para manejarlo externamente si es necesario
      }),
      finalize(() => this.loaderService.hide()) // Oculta el loader al finalizar
    );
  }

  // Método para iniciar sesión y guardar los datos en el localStorage
  loginAndSaveSession(data: LoginData): Observable<LoginResponse> {
    this.loaderService.show(); // Muestra el loader
    return this.http.post<LoginResponse>(`${this.baseUrl}/users/login/`, data).pipe(
      tap(response => {
        // Extrae los datos de la respuesta
        const accessToken = response.data.session.access_token;
        const refreshToken = response.data.session.refresh_token;
        const userInfo = response.data.userInfo;

        // Guarda los datos en el localStorage
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('user_Info', JSON.stringify(userInfo)); // Guarda userInfo como JSON

        // Actualiza el BehaviorSubject para indicar que el usuario está autenticado
        this.isAuthenticatedSubject.next(true);
      }),
      finalize(() => this.loaderService.hide()) // Oculta el loader al finalizar
    );
  }

  // Método para cerrar sesión
  logout() {
    // Elimina los datos de la sesión del localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_Info');

    // Actualiza el BehaviorSubject para indicar que el usuario ya no está autenticado
    this.toastr.success('Saliste de tu cuenta', '¡Éxito!')
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/']);
  }

  // Método para obtener información del usuario
  getUserInfo(): Observable<User> {
    const userId = JSON.parse(localStorage.getItem('user_Info') || '{}').sub;
    const url = `${this.baseUrl}/users/getInfo/`;
    this.loaderService.show(); // Muestra el loader
    return this.http.post<{ data: User }>(url, { userId }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    }).pipe(
      map(response => response.data), // Extrae la data del objeto de respuesta
      finalize(() => this.loaderService.hide()) // Oculta el loader al finalizar
    );
  }

  updatePassword(userId: string, newPassword: string): Observable<any> {
    const url = `${this.baseUrl}/users/updatePassword`;
    return this.http.patch(url, { userId, newPassword }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    });
  }


  deleteAccount(userId: string): Observable<any> {
    const url = `${this.baseUrl}/users/deleteAccount`;
    return this.http.delete(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      body: { userId }
    });
  }

}
