import { Component, OnInit } from '@angular/core';
import { AuthService, Seat } from '../../../core/services/auth.service'; // Importa la interfaz desde el servicio
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  seatsDictionary: { [key: string]: Seat[] } = {};
  selectedSeats: Seat[] = [];
  isMobile: boolean = false;
  movie: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 768;
    this.loadSeats();
    this.loadMovieDetails();

    // Limpiar los asientos seleccionados al cargar la pantalla
  this.selectedSeats = [];
  localStorage.removeItem('selectedSeats');

  this.loadSeats();
  this.loadMovieDetails();
  }


  // Método reutilizado de movie-detail
  loadMovieDetails(): void {
    const movieId = localStorage.getItem('selectedMovieId');
    if (movieId) {
      this.authService.getMovieShowings(movieId).subscribe({
        next: (response) => {
          if (response && response.data.length > 0) {
            this.movie = response.data[0].movie;
          }
        },
        error: (err) => {
          console.error('Error al cargar los detalles de la película:', err);
        },
      });
    }
  }


  loadSeats(): void {
    const roomId = Number(localStorage.getItem('selectedRoomNumber'));
    this.authService.getSeatsByRoom(roomId).subscribe({
      next: (seats: Seat[]) => {
        this.seatsDictionary = seats.reduce((dict: { [key: string]: Seat[] }, seat: Seat) => {
          if (!dict[seat.row]) {
            dict[seat.row] = [];
          }
          dict[seat.row].push(seat);
          return dict;
        }, {});
      },
      error: (error) => {
        console.error('Error al cargar los asientos:', error);
      }
    });
  }


  toggleSeatSelection(seat: Seat): void {
    if (seat.status === 'disponible') {
      const index = this.selectedSeats.findIndex((s) => s.id === seat.id);
      if (index > -1) {
        this.selectedSeats.splice(index, 1);
      } else {
        this.selectedSeats.push(seat);
      }
    }
  }

  getSeatClass(seat: Seat): string {
    if (seat.status === 'disponible' && this.selectedSeats.some((s) => s.id === seat.id)) {
      return 'bg-orange-500 text-white';
    }
    switch (seat.status) {
      case 'disponible':
        return 'bg-green-500 text-white';
      case 'reservado':
        return 'bg-red-500 text-white';
      case 'en reserva':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  }

  confirmSelection(): void {
    if (this.selectedSeats.length === 0) {
      alert('Por favor, selecciona al menos un asiento.');
      return;
    }

    const roomNumber = Number(localStorage.getItem('selectedRoomNumber'));

    if (!roomNumber) {
      alert('El número de sala no está definido. Por favor, intenta de nuevo.');
      return;
    }

    // Generar el cuerpo del POST para actualizar el estado de los asientos
    const seatStatusId = 'de50d8da-e989-438c-8506-764be71088c8'; // ID del estado de reserva
    const seatIds = this.selectedSeats.map(seat => seat.id); // IDs de los asientos seleccionados
    const updateSeatStatusPayload = {
      seatStatusId: seatStatusId,
      seatId: seatIds,
    };

    // Mostrar en consola el payload para depuración
    console.log('Payload para actualizar estado de asientos:', updateSeatStatusPayload);

    // Llamar al endpoint para actualizar el estado de los asientos
    this.authService.updateSeatStatus(updateSeatStatusPayload).subscribe({
      next: (updateResponse) => {
        console.log('Estado de los asientos actualizado:', updateResponse);

        // Generar el cuerpo del POST para el resumen de reserva
        const reservationBody = {
          seats: this.selectedSeats.map(seat => ({
            id: seat.id,
            seatType: seat.seatType,
            status: 'reservado', // Cambia el estado a reservado
            roomNumber: roomNumber,
            row: seat.row,
            seatNumber: seat.seatNumber,
          })),
          roomNumber: roomNumber,
        };

        // Mostrar en consola el payload para el endpoint de resumen de reserva
        console.log('Payload para el resumen de reserva:', reservationBody);

        // Llamar al endpoint del resumen de reserva
        this.authService.sendReservationSummary(reservationBody).subscribe({
          next: (reservationResponse) => {
            console.log('Reserva exitosa:', reservationResponse);

            // Guarda los asientos seleccionados en el localStorage
            localStorage.setItem('selectedSeats', JSON.stringify(this.selectedSeats));

            // Redirigir al usuario a la página de resumen
            this.router.navigate(['features/user/summary']);
          },
          error: (reservationError) => {
            console.error('Error al realizar la reserva:', reservationError);
            alert('Hubo un problema al realizar la reserva. Por favor, inténtalo de nuevo.');
          },
        });
      },
      error: (updateError) => {
        console.error('Error al actualizar el estado de los asientos:', updateError);
        if (updateError.error) {
          console.error('Detalle del error del backend:', updateError.error);
        }
        alert('Hubo un problema al intentar actualizar el estado de los asientos. Por favor, inténtalo de nuevo.');
      },
    });
  }

  cancelReservation(): void {
    // Lista de claves relacionadas con la reserva que deben ser eliminadas
    const keysToRemove = [
      'selectedMovieId',
      'selectedMovieName',
      'selectedRoomNumber',
      'selectedSeats',
      'selectedShowingId',
      'reservationId',
    ];

    // Eliminar claves del localStorage
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    // Redirigir al home
    this.router.navigate(['/home']);
  }






}
