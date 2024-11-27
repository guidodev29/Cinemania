import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  movie: any = null;
  priceSummary: any = null; // Aquí se almacenará la respuesta del precio

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadMovieDetails();
    this.loadPriceSummary();
  }

  // Reutilizamos el método para cargar detalles de la película
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

  // Cargar el resumen del precio
  loadPriceSummary(): void {
    const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats') || '[]');
    const roomNumber = Number(localStorage.getItem('selectedRoomNumber'));

    if (selectedSeats.length > 0 && roomNumber) {
      const body = {
        seats: selectedSeats,
        roomNumber: roomNumber
      };

      this.authService.sendReservationSummary(body).subscribe({
        next: (response) => {
          this.priceSummary = response.data;
          console.log('Resumen de precios cargado:', this.priceSummary);
        },
        error: (err) => {
          console.error('Error al cargar el resumen de precios:', err);
        }
      });
    } else {
      console.error('No hay asientos seleccionados o el número de sala no está definido.');
    }
  }

  proceedToPayment(): void {
    // Aquí puedes manejar la lógica para proceder al pago
    console.log('Datos enviados:', {
      movie: this.movie,
      priceSummary: this.priceSummary,
    });

    this.router.navigate(['/payment-card']);
    // Puedes redirigir al usuario a otra página o manejar el proceso del pago aquí
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
