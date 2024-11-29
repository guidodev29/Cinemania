import { Injectable } from '@angular/core';
import {environment} from "../../../../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {IShowings, IUpdateShowing} from "../../interface/IServicesAdmins.interface";

@Injectable({
  providedIn: 'root'
})
export class ShowingsService {
  private baseUrl = environment.apiBaseSpringBoot;


  constructor(private http: HttpClient) {}

  delete<T>(id: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}showings/${id}`);
  }

  getOne(id: string): Observable<IShowings> {
    return this.http.get<{ data: IShowings }>(`${this.baseUrl}showings/${id}`).pipe(
      map(response => response.data) // Extrae el objeto 'data'
    );
  }

  getByMovieId(id: string): Observable<IShowings[]> {
    return this.http.get<{ data: IShowings[] }>(`${this.baseUrl}showings/by/${id}`).pipe(
      map(response => response.data) // Extrae el objeto 'data'
    );
  }


  getAll(): Observable<IShowings[]> {
    return this.http.get<{ data: IShowings[] }>(`${this.baseUrl}showings/`).pipe(
      map(response => response.data)
    );
  }


  post<T>(body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}showings/`, body);
  }

  put<T>(id: string, body: IUpdateShowing): Observable<IShowings> {
    return this.http.put<IShowings>(`${this.baseUrl}showings/${id}`, body);
  }
}
