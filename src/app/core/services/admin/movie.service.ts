import { Injectable } from '@angular/core';
import {IApiService} from "../../interface/IApiService";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {environment} from "../../../../environment";
import {HttpClient} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {MovieAdmin} from "../../../features/admin/movies-admin/Model/MovieAdmin";

@Injectable({
  providedIn: 'root'
})
export class MovieService implements IApiService {
  private baseUrl = environment.apiBaseSpringBoot;


  constructor(private http: HttpClient) {}


  delete<T>(id: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}movies/${id}`);
  }

  get<T>(id: string, params?: any): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${id}`, { params });
  }

  // @ts-ignore
  getAll(): Observable<MovieAdmin[]> {
    return this.http.get<{ data: MovieAdmin[] }>(`${this.baseUrl}movies/`).pipe(
      map(response => response.data) // Extraemos solo el array de películas
    );
  }

  updateMovie(movie: MovieAdmin): Observable<MovieAdmin> {
    return this.http.put<MovieAdmin>(`${this.baseUrl}movies/${movie.id}`, movie).pipe(
      map((response: any) => {
        console.log('Update successful:', response);
        return response; // You can type the response if needed.
      }),
      catchError(error => {
        console.error('Error updating movie:', error);
        return throwError(() => new Error('Failed to update movie. Please try again.'));
      })
    );
  }

  addMovie(movie: MovieAdmin): Observable<MovieAdmin> {
    return this.http.post<MovieAdmin>(`${this.baseUrl}movies/`, movie).pipe(
      map((response: any) => {
        console.log('Update successful:', response);
        return response; // You can type the response if needed.
      }),
      catchError(error => {
        console.error('Error updating movie:', error);
        return throwError(() => new Error('Failed to update movie. Please try again.'));
      })
    )
  }

  post<T>(body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}movies/`, body);
  }

  put<T>(body: any, params?: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}movies/${params}`, body);
  }
}
