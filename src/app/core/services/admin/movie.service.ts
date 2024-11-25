import { Injectable } from '@angular/core';
import {IApiService} from "../../interface/IApiService";
import {Observable} from "rxjs";
import {environment} from "../../../../environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MovieService implements IApiService {
  private baseUrl = environment.apiBaseSpringBoot;

  constructor(private http: HttpClient) { }

  delete<T>(id: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${id}`);
  }

  get<T>(id: string, params?: any): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`, {params});
  }

  getAll<T>(): Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl);
  }


  post<T>(body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/movies/`, body);
  }

  put<T>(body: any, params?: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/movies/${params}`, body);
  }

}
