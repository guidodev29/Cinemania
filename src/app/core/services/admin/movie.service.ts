import { Injectable } from '@angular/core';
import {IApiService} from "../../interface/IApiService";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {environment} from "../../../../environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MovieService implements IApiService {
  private baseUrl = environment.apiBaseSpringBoot;
  // BehaviorSubject para manejar el estado de autenticación
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  // Observable público para que otros componentes puedan suscribirse
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();


  constructor(private http: HttpClient) {}

// Verifica si el token existe en el localStorage
  public hasToken(): boolean {
    return !localStorage.getItem('access_token');
  }

  private validateToken(): boolean {
    if (!this.hasToken()) {
      console.error('Error: No se encontró un token. Redirigiendo al login...');
      // Aquí puedes redirigir al login o manejar el error
      return false;
    }
    return true;
  }

  delete<T>(id: string): Observable<T> {
    if (!this.validateToken()) {
      return throwError(() => new Error('No se encontró un token.'));
    }
    return this.http.delete<T>(`${this.baseUrl}/${id}`);
  }

  get<T>(id: string, params?: any): Observable<T> {
    if (!this.validateToken()) {
      return throwError(() => new Error('No se encontró un token.'));
    }
    return this.http.get<T>(`${this.baseUrl}/${id}`, { params });
  }

  getAll(): Observable<[]> {
    if (!this.validateToken()) {
      return throwError(() => new Error('No se encontró un token.'));
    }
    return this.http.get<[]>(this.baseUrl);
  }

  post<T>(body: any): Observable<T> {
    if (!this.validateToken()) {
      return throwError(() => new Error('No se encontró un token.'));
    }
    return this.http.post<T>(`${this.baseUrl}/movies/`, body);
  }

  put<T>(body: any, params?: any): Observable<T> {
    if (!this.validateToken()) {
      return throwError(() => new Error('No se encontró un token.'));
    }
    return this.http.put<T>(`${this.baseUrl}/movies/${params}`, body);
  }
}
