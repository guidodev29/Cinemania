import { Injectable } from '@angular/core';
import {environment} from "../../../../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ICategories} from "../../interface/IServicesAdmins.interface";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ClassificationsService {
  private baseUrl = environment.apiBaseSpringBoot;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ICategories[]> {
    return this.http.get<{ data: ICategories[] }>(`${this.baseUrl}classifications/`).pipe(
      map(response => response.data) // Extraemos solo el array de películas
    );
  }
}
