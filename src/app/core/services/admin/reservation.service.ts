import { Injectable } from '@angular/core';
import {environment} from "../../../../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IReservation, IRooms} from "../../interface/IServicesAdmins.interface";
import {map} from "rxjs/operators";
import {ReservationAdmin} from "../../../features/admin/reservation-admin/model/ReservationAdminModel";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private baseUrl = environment.apiBasePython;


  constructor(private http: HttpClient) {}

//TODO: COMPROBAR QUE SE ESTE MAPEANDO
  getAll(): Observable<ReservationAdmin[]> {
    return this.http.get<{ data: ReservationAdmin[] }>(`${this.baseUrl}reservation/admin`).pipe(
      map(response => response.data) // Extraemos solo el array de películas
    );
  }
}
