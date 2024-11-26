import { Component, OnInit } from '@angular/core';
import { ReservationAdmin} from "./model/ReservationAdminModel";

@Component({
  selector: 'app-reservation-admin',
  templateUrl: './reservation-admin.component.html',
  styleUrls: ['./reservation-admin.component.css']
})
export class ReservationAdminComponent implements OnInit {
  // Mock de datos completos
  reservations: ReservationAdmin[] = [
    {
      reservationId: "16ab6048-07df-4d57-9783-173b90611da0",
      reservationTotalPrice: 50.0,
      user_id: "64688402-a3a6-477b-8cca-abc399bd4757",
      showingId: "4451ce78-b961-4c8a-a996-092877b0b213",
      showingStartTime: "2024-11-26T08:00:00",
      showingEndTime: "2024-11-26T09:49:00",
      showingDate: "2024-11-19",
      movieName: "Venom: El último baile",
      movieDirector: "Kelly Marcel",
      movieDescription: "Eddie y Venom están a la fuga. Perseguidos por sus sendos mundos y cada vez más cercados, el dúo se ve abocado a tomar una decisión devastadora que hará que caiga el telón sobre el último baile de Venom y Eddie.",
      roomType: "2D",
      roomPrice: 1.5,
      roomNumber: 1,
      tickets: [
        {
          ticketId: "6ec24a95-c9ea-41e3-9944-154eec48f7db",
          ticketPrice: 25.0,
          ticketPurchaseTime: "2024-11-16",
          seatNumber: 2,
          seatRow: "A",
          seatType: "Normales",
          seatStatus: "en reserva",
          seatReservedAt: null
        },
        {
          ticketId: "1f1e67d4-da28-4c3f-b827-6c069b27bd23",
          ticketPrice: 25.0,
          ticketPurchaseTime: "2024-11-16",
          seatNumber: 3,
          seatRow: "A",
          seatType: "Normales",
          seatStatus: "en reserva",
          seatReservedAt: null
        }
      ]
    },
    {
      reservationId: "37b9c3d1-27c6-47a9-9d9f-c7a5e6729cc2",
      reservationTotalPrice: 45.0,
      user_id: "12345678-aaaa-477b-8cca-abc399bd4757",
      showingId: "6451ce78-b961-4c8a-a996-092877b0b211",
      showingStartTime: "2024-12-02T18:00:00",
      showingEndTime: "2024-12-02T19:49:00",
      showingDate: "2024-11-28",
      movieName: "Spider-Man: No Way Home",
      movieDirector: "Jon Watts",
      movieDescription: "Peter Parker luchará contra las consecuencias de la revelación pública de su identidad y el multiverso.",
      roomType: "3D",
      roomPrice: 2.0,
      roomNumber: 2,
      tickets: [
        {
          ticketId: "b3d24a95-d9ea-41e3-9944-2145eec48f7db",
          ticketPrice: 22.5,
          ticketPurchaseTime: "2024-11-20",
          seatNumber: 1,
          seatRow: "B",
          seatType: "VIP",
          seatStatus: "en reserva",
          seatReservedAt: null
        },
        {
          ticketId: "2b3d24a95-d9ea-41e3-9944-2145eec48f7db",
          ticketPrice: 22.5,
          ticketPurchaseTime: "2024-11-20",
          seatNumber: 2,
          seatRow: "B",
          seatType: "VIP",
          seatStatus: "en reserva",
          seatReservedAt: null
        }
      ]
    },
    {
      reservationId: "6a7fd301-ec36-48c4-bd9b-9e223f9a5399",
      reservationTotalPrice: 60.0,
      user_id: "23456789-bbbb-477b-8cca-abc399bd4757",
      showingId: "8451ce78-b961-4c8a-a996-092877b0b110",
      showingStartTime: "2024-12-05T20:00:00",
      showingEndTime: "2024-12-05T22:00:00",
      showingDate: "2024-11-30",
      movieName: "Doctor Strange en el multiverso de la locura",
      movieDirector: "Sam Raimi",
      movieDescription: "El Doctor Strange trata de manejar las implicaciones del multiverso mientras se enfrenta a misteriosas amenazas.",
      roomType: "IMAX",
      roomPrice: 3.0,
      roomNumber: 3,
      tickets: [
        {
          ticketId: "d4f24a95-d9ea-41e3-9944-1245eec48f7db",
          ticketPrice: 30.0,
          ticketPurchaseTime: "2024-11-21",
          seatNumber: 5,
          seatRow: "C",
          seatType: "Normales",
          seatStatus: "en reserva",
          seatReservedAt: null
        },
        {
          ticketId: "e5f24a95-d9ea-41e3-9944-2145eec48f7db",
          ticketPrice: 30.0,
          ticketPurchaseTime: "2024-11-21",
          seatNumber: 6,
          seatRow: "C",
          seatType: "Normales",
          seatStatus: "en reserva",
          seatReservedAt: null
        }
      ]
    },
    {
      reservationId: "dd1b6e60-334a-45ab-8ef7-5f66021975c8",
      reservationTotalPrice: 55.0,
      user_id: "34567890-cccc-477b-8cca-abc399bd4757",
      showingId: "7451ce78-b961-4c8a-a996-092877b0b107",
      showingStartTime: "2024-12-08T19:00:00",
      showingEndTime: "2024-12-08T21:00:00",
      showingDate: "2024-12-01",
      movieName: "Black Panther: Wakanda Forever",
      movieDirector: "Ryan Coogler",
      movieDescription: "El mundo se enfrenta a la pérdida del rey T'Challa mientras Wakanda lidia con nuevas amenazas.",
      roomType: "2D",
      roomPrice: 2.5,
      roomNumber: 1,
      tickets: [
        {
          ticketId: "f3d24a95-d9ea-41e3-9944-3125eec48f7db",
          ticketPrice: 27.5,
          ticketPurchaseTime: "2024-11-25",
          seatNumber: 1,
          seatRow: "A",
          seatType: "VIP",
          seatStatus: "en reserva",
          seatReservedAt: null
        },
        {
          ticketId: "g6f24a95-d9ea-41e3-9944-4145eec48f7db",
          ticketPrice: 27.5,
          ticketPurchaseTime: "2024-11-25",
          seatNumber: 2,
          seatRow: "A",
          seatType: "VIP",
          seatStatus: "en reserva",
          seatReservedAt: null
        }
      ]
    },
    {
      reservationId: "dd1b62360-334a-45ab-8ef7-5f66021975c8",
      reservationTotalPrice: 55.0,
      user_id: "34567890-cccc-477b-8cca-abc399bd4757",
      showingId: "7451ce78-b961-4c8a-a996-092877b0b107",
      showingStartTime: "2024-12-08T19:00:00",
      showingEndTime: "2024-12-08T21:00:00",
      showingDate: "2024-12-01",
      movieName: "Marquito La pelicula",
      movieDirector: "Ryan Coogler",
      movieDescription: "El mundo esta conspirando contra markito",
      roomType: "2D",
      roomPrice: 2.5,
      roomNumber: 1,
      tickets: [
        {
          ticketId: "f3d24a95-d9ea-41e3-9944-3125eec48f7db",
          ticketPrice: 27.5,
          ticketPurchaseTime: "2024-11-25",
          seatNumber: 1,
          seatRow: "A",
          seatType: "VIP",
          seatStatus: "en reserva",
          seatReservedAt: null
        },
        {
          ticketId: "g6f24a95-d9ea-41e3-9944-4145eec48f7db",
          ticketPrice: 27.5,
          ticketPurchaseTime: "2024-11-25",
          seatNumber: 2,
          seatRow: "A",
          seatType: "VIP",
          seatStatus: "en reserva",
          seatReservedAt: null
        }
      ]
    },
    {
      reservationId: "dd1b62360-334a-45ab-8e312-5f66021975c8",
      reservationTotalPrice: 100.0,
      user_id: "34567890-cccc-477b-8cca-abc399bd4757",
      showingId: "7451ce78-b961-4c8a-a996-092877b0b107",
      showingStartTime: "2024-12-08T19:00:00",
      showingEndTime: "2024-12-08T21:00:00",
      showingDate: "2024-12-01",
      movieName: "Suspirando los llantos de dody",
      movieDirector: "Ryan Coogler",
      movieDescription: "Una pelicula recorriendo todos los lamentos del dody",
      roomType: "2D",
      roomPrice: 2.5,
      roomNumber: 1,
      tickets: [
        {
          ticketId: "f3d24a95-d9ea-41e3-9944-3125eec48f7db",
          ticketPrice: 27.5,
          ticketPurchaseTime: "2024-11-25",
          seatNumber: 1,
          seatRow: "A",
          seatType: "VIP",
          seatStatus: "en reserva",
          seatReservedAt: null
        },
        {
          ticketId: "g6f24a95-d9ea-41e3-9944-4145eec48f7db",
          ticketPrice: 27.5,
          ticketPurchaseTime: "2024-11-25",
          seatNumber: 2,
          seatRow: "A",
          seatType: "VIP",
          seatStatus: "en reserva",
          seatReservedAt: null
        }
      ]
    }
  ];

  selectedReservation: ReservationAdmin | null = null;
  modalOpen: boolean = false;

  // Getter para calcular la ganancia total
  get totalEarnings(): number {
    return this.reservations.reduce((total, reservation) => total + reservation.reservationTotalPrice, 0);
  }

  constructor() {}

  ngOnInit(): void {}

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
}
