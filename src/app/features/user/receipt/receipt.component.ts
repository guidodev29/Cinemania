import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {
  user: any = {};
  movie: any = {};
  reservedSeats: any[] = [];
  priceSummary: any = {};
  totalPrice: number = 0;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadMovieDetails();
    this.loadPriceSummary();
  }

  // Cargar información del usuario desde localStorage
  loadUserInfo(): void {
    const userInfo = localStorage.getItem('user_Info');
    this.user = userInfo ? JSON.parse(userInfo) : {};
  }

  // Reutilizar el método para cargar detalles de la película
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
          this.totalPrice = response.data.totalPrice;
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

  goToHome(): void {
    this.router.navigate(['/home']);
  }

}
