import { Component, OnInit } from '@angular/core';
import { ReservationAdmin} from "./model/ReservationAdminModel";
import {environment} from "../../../../environment";
import {MovieService} from "../../../core/services/admin/movie.service";
import {ToastrService} from "ngx-toastr";
import {ReservationService} from "../../../core/services/admin/reservation.service";
import {MovieAdmin} from "../movies-admin/Model/MovieAdmin";

@Component({
  selector: 'app-reservation-admin',
  templateUrl: './reservation-admin.component.html',
  styleUrls: ['./reservation-admin.component.css']
})
export class ReservationAdminComponent implements OnInit {
  private baseUrl = environment.apiBaseSpringBoot;

  // Mock de datos completos
  reservations: ReservationAdmin[] = []
  selectedReservation: ReservationAdmin | null = null;
  modalOpen: boolean = false;

  // Getter para calcular la ganancia total
  get totalEarnings(): number {
    return this.reservations.reduce((total, reservation) => total + reservation.reservationTotalPrice, 0);
  }

  constructor(
    private toastr: ToastrService,
    private reservation: ReservationService
  ) {}

  ngOnInit(): void {
    this.loadAllReservations()
  }

  // Método para abrir el modal
  openModal(reservation: ReservationAdmin): void {
    this.selectedReservation = reservation;
    this.modalOpen = true;
  }

  // Método para cerrar el modal
  closeModal(): void {
    this.modalOpen = false;
    this.selectedReservation = null;
  }

  loadAllReservations(): void {
    this.reservation.getAll().subscribe(
      (data: ReservationAdmin[]) => {
        this.reservations = data;
      },
      error => {
        console.error('Error al obtener las películas:', error);
        this.toastr.error('Hubo un problema al cargar las películas', 'Error');
      }
    )
  }
}
