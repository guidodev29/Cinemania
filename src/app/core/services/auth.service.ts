import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { map, tap, finalize, catchError } from 'rxjs/operators';
import { LoaderService } from 'src/app/core/services/loader.service';
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




  private seatsUrl = 'http://localhost:8080/api/v1/seat/';
  private springUrl = 'http://localhost:8080/api/v1/';

  getSeatsByRoom(roomId: number): Observable<Seat[]> {
    const token = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJrVUU4Y2Njemh3bDE3STkzTmoxZU9sRHpTMWo3c3BTNGszZjFIWUhkeWRFIn0.eyJleHAiOjE3MzIzODEyMzYsImlhdCI6MTczMjM4MDkzNiwianRpIjoiNTkxMTBmODEtYzVkYS00NzEzLTk0NTgtNTIzZjJmMWRjNWRlIiwiaXNzIjoiaHR0cHM6Ly9tYWtpYm9sYW5kLnh5ei9yZWFsbXMvY2luZW1hbmlhLWRldiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYnJva2VyIiwiYWNjb3VudCJdLCJzdWIiOiI2OTc5ZGQ0Yi1hMDU3LTRkMzktYTA2Zi02OWFhYzg0OTZjMTYiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJjaW5lbWFuaWEtY2xpZW50Iiwic2Vzc2lvbl9zdGF0ZSI6IjIxMDk1YjAzLTU3ZWMtNDQyZC1hNjY1LWJhNDQxZDUzN2U1MSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImRlZmF1bHQtcm9sZXMtY2luZW1hbmlhLWRldiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7InJlYWxtLW1hbmFnZW1lbnQiOnsicm9sZXMiOlsidmlldy1pZGVudGl0eS1wcm92aWRlcnMiLCJ2aWV3LXJlYWxtIiwibWFuYWdlLWlkZW50aXR5LXByb3ZpZGVycyIsImltcGVyc29uYXRpb24iLCJyZWFsbS1hZG1pbiIsImNyZWF0ZS1jbGllbnQiLCJtYW5hZ2UtdXNlcnMiLCJxdWVyeS1yZWFsbXMiLCJ2aWV3LWF1dGhvcml6YXRpb24iLCJxdWVyeS1jbGllbnRzIiwicXVlcnktdXNlcnMiLCJtYW5hZ2UtZXZlbnRzIiwibWFuYWdlLXJlYWxtIiwidmlldy1ldmVudHMiLCJ2aWV3LXVzZXJzIiwidmlldy1jbGllbnRzIiwibWFuYWdlLWF1dGhvcml6YXRpb24iLCJtYW5hZ2UtY2xpZW50cyIsInF1ZXJ5LWdyb3VwcyJdfSwiYnJva2VyIjp7InJvbGVzIjpbInJlYWQtdG9rZW4iXX0sImNpbmVtYW5pYS1jbGllbnQiOnsicm9sZXMiOlsiYXBwIGFkbWluIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50Iiwidmlldy1hcHBsaWNhdGlvbnMiLCJ2aWV3LWNvbnNlbnQiLCJ2aWV3LWdyb3VwcyIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwiZGVsZXRlLWFjY291bnQiLCJtYW5hZ2UtY29uc2VudCIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6IjIxMDk1YjAzLTU3ZWMtNDQyZC1hNjY1LWJhNDQxZDUzN2U1MSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiY2luZW1hIG1hbmlhIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiY2luZW1hbmlhcHJpbmNpcGFsIiwiZ2l2ZW5fbmFtZSI6ImNpbmVtYSIsImZhbWlseV9uYW1lIjoibWFuaWEiLCJlbWFpbCI6ImNpbmVtYUBnbWFpbC5jb20ifQ.Y364-IjINXq6IHx6stNVhZoCvQGDH3lvplJdNzNsbZQ_aTvdAfjB1TOW_fmLkeCcR-HY30zESvsgCMx7j_R2AChDTBg_mDFZRgftnxxRmRu6btTz3YwyBHBf3SOSeIiVGET_Dcgx5QR3-poLXMlnQZooxPzXxIWVtaZ7LsSk515KLS_tWvIJiO_nLqhEq5J1YB274zE7Yw9ZO3WzBNBvOTwmRsXOYcH7DWIM0y82ZFFsejk_gIj88P9Fm3Wh9J0WXCW9w0CuXIJPE7NiTxKYQDoGBEJTgRG5x5X59xaMsfQSH7kGfNQYAb-6lQuCDqzCUC-GTn40P-vnnpwcCee1-g';
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<{ data: Seat[] }>(`${this.seatsUrl}${roomId}`, { headers }).pipe(
      map(response => response.data) // Extrae únicamente el campo `data`
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





}

// Define la interfaz Seat
export interface Seat {
  id: string;
  row: string;
  seatNumber: number;
  seatType: string;
  status: 'disponible' | 'reservado' | 'en reserva';
}


