import {Observable} from "rxjs";
import {MovieAdmin} from "../../features/admin/movies-admin/Model/MovieAdmin";

export interface IApiService {
  get<T>(id: string, params?: any): Observable<ApiResponse<T>>;
  getAll(): Observable<ApiResponse<MovieAdmin[]>>;
  post<T>(body: any): Observable<ApiResponse<T>>;
  put<T>(body: any, params?: any): Observable<ApiResponse<T>>;
  delete<T>(id: string): Observable<ApiResponse<T>>;
}

export interface isAdmin {
  getAdmin<T>(url: string): Observable<T>;
}

export interface ApiResponse<T> {
  data: T;
}
