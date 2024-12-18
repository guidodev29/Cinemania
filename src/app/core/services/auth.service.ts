import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable, of, switchMap, throwError} from 'rxjs';
import { Router } from '@angular/router';
import { map, tap, finalize, catchError } from 'rxjs/operators';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ToastrService } from 'ngx-toastr';
import {environment} from "../../../environment";


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
  private baseUrl = 'https://cinemania-python-e2c810c96dba.herokuapp.com/api/v1';
  private springUrl = 'https://cinemania-springboot-a0f60d8ba518.herokuapp.com/api/v1/';
  private baseUrlPython = environment.apiBasePython;

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

  //Login para admin y verificación de rol
  loginAdminAndSaveSession(data: LoginData): Observable<LoginResponse> {
    this.loaderService.show(); // Muestra el loader
    return this.http.post<LoginResponse>(`${this.baseUrlPython}users/login`, data).pipe(
      switchMap(response => {
        const accessToken = response.data.session.access_token;
        const refreshToken = response.data.session.refresh_token;
        const userInfo = response.data.userInfo;

        // Guardar tokens e información del usuario
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('user_Info', JSON.stringify(userInfo));

        // Realizar la validación del rol
        return this.http.get(`${this.baseUrlPython}check-admin-role`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        }).pipe(
          map(() => {
            // Si el rol es válido, guardar como admin y retornar el LoginResponse original
            localStorage.setItem('is_admin', 'true');
            this.isAuthenticatedSubject.next(true);
            return response; // Retornar el LoginResponse original
          }),
          catchError(error => {
            // Si falla la validación del rol
            localStorage.setItem('is_admin', 'false');
            this.isAuthenticatedSubject.next(false);
            console.error('Error en check-admin-role:', error);
            return throwError(() => new Error('No tiene privilegios de administrador.'));
          })
        );
      }),
      catchError(error => {
        // Manejar errores de login
        console.error('Error en el login:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loaderService.hide()) // Ocultar el loader al finalizar
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

  // Método para cerrar sesión
  cleanLocal() {
    localStorage.removeItem('selectedShowingId');
    localStorage.removeItem('selectedSeats');
    localStorage.removeItem('selectedRoomNumber');
    localStorage.removeItem('selectedMovieId');
    localStorage.removeItem('selectedMovie');
    localStorage.removeItem('reservationId');
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


  getSeatsByRoom(roomId: number): Observable<Seat[]> {
    // No necesitamos manejar manualmente el token aquí
    return this.http.get<{ data: Seat[] }>(`${this.springUrl}seat/${roomId}`).pipe(
      map(response => response.data)  // Extrae únicamente el campo `data`
    );
  }

  // Método para obtener las películas
  getMovies(): Observable<any> {
    const moviesUrl = `${this.springUrl}movies/`; // Endpoint de películas
    return this.http.get(moviesUrl);
  }


  getMovieShowings(movieId: string) {
    return this.http.get<any>(`${this.springUrl}showings/by/${movieId}`);
  }

  sendReservationSummary(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reservation/summary`, body);
  }

  updateSeatStatus(payload: { seatStatusId: string; seatId: string[] }): Observable<any> {
    const url = `${this.springUrl}seat/update-all-seat-status`;
    return this.http.post<any>(url, payload);
  }

  createReservation(payload: any) {
    const url = `${this.baseUrl}/reservation/create`;
    return this.http.post<any>(url, payload);
  }

  getReservationsByUserId(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/reservation/detail/${userId}`);
  }



}

// Define la interfaz Seat
export interface Seat {
  id: string;
  row: string;
  seatNumber: number;
  seatType: string;
  status: 'disponible' | 'reservado' | 'en reserva';
}


