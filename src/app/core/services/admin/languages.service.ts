import { Injectable } from '@angular/core';
import {environment} from "../../../../environment";
import {HttpClient} from "@angular/common/http";
import {ICategories} from "../../interface/IServicesAdmins.interface";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {
  private baseUrl = environment.apiBaseSpringBoot;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ICategories[]> {
    return this.http.get<{ data: ICategories[] }>(`${this.baseUrl}languages/`).pipe(
      map(response => response.data) // Extraemos solo el array de películas
    );
  }
}
