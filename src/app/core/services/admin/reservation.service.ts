import { Injectable } from '@angular/core';
import {environment} from "../../../../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IReservation, IRooms} from "../../interface/IServicesAdmins.interface";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private baseUrl = environment.apiBaseSpringBoot;


  constructor(private http: HttpClient) {}

//TODO: COMPROBAR QUE SE ESTE MAPEANDO
  getAll(): Observable<IReservation[]> {
    return this.http.get<{ data: IReservation[] }>(`${this.baseUrl}reservation/admin`).pipe(
      map(response => response.data) // Extraemos solo el array de películas
    );
  }
}
