import {Observable} from "rxjs";

export interface IApiService {
  get<T>(id: string, params?: any): Observable<T>;
  getAll<T>(): Observable<T[]>;
  post<T>(body: any): Observable<T>;
  put<T>(body: any, params?: any): Observable<T>;
  delete<T>(id: string): Observable<T>;
}

export interface isAdmin {
  getAdmin<T>(url: string): Observable<T>;
}
