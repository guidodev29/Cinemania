import { Injectable } from '@angular/core';
import {environment} from "../../../../environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {MovieAdmin} from "../../../features/admin/movies-admin/Model/MovieAdmin";
import {map} from "rxjs/operators";
import {ISeatAllStatus, ISeats, ISeatStatus} from "../../interface/IServicesAdmins.interface";

@Injectable({
  providedIn: 'root'
})
export class SeatsService {
  private baseUrl = environment.apiBaseSpringBoot;


  constructor(private http: HttpClient) {}

  get(id?: number): Observable<ISeats[]> {
    return this.http.get<{ data: ISeats[] }>(`${this.baseUrl}seat/${id}`).pipe(
      map(response => response.data) // Extrae el array de asientos desde la propiedad 'data'
    );
  }


  postSeatStatus(body: ISeatStatus): Observable<ISeatStatus> {
    return this.http.post<ISeatStatus>(`${this.baseUrl}/seat/seat-status`, body);
  }

  postAllSeatsStatus(body: ISeatAllStatus): Observable<ISeatAllStatus> {
    return this.http.post<ISeatAllStatus>(`${this.baseUrl}/seat/seat-status`, body);
  }

}
