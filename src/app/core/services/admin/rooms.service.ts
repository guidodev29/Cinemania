import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {MovieAdmin} from "../../../features/admin/movies-admin/Model/MovieAdmin";
import {map} from "rxjs/operators";
import {environment} from "../../../../environment";
import {HttpClient} from "@angular/common/http";
import {IRooms} from "../../interface/IServicesAdmins.interface";

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private baseUrl = environment.apiBaseSpringBoot;

  constructor(private http: HttpClient) {}


  getAll(): Observable<IRooms[]> {
    return this.http.get<{ data: IRooms[] }>(`${this.baseUrl}rooms/`).pipe(
      map(response => response.data) // Extraemos solo el array de películas
    );
  }
}
