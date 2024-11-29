import { Injectable } from '@angular/core';
import {environment} from "../../../../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ICategories, IShowingDates} from "../../interface/IServicesAdmins.interface";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ShowingDatesService {
  private baseUrl = environment.apiBaseSpringBoot;

  constructor(private http: HttpClient) {}

  getAll(): Observable<IShowingDates[]> {
    return this.http.get<{ data: IShowingDates[] }>(`${this.baseUrl}show-times/`).pipe(
      map(response => response.data) // Extraemos solo el array de películas
    );
  }
}
