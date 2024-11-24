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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 768;
    this.loadSeats();
  }

  loadSeats(): void {
    const roomId = 1; // Cambia este ID según corresponda
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
      // Si no hay asientos seleccionados, muestra alerta
      alert('Por favor, selecciona al menos un asiento.');
      return;
    }

    // Guarda los asientos seleccionados en el localStorage
    localStorage.setItem('selectedSeats', JSON.stringify(this.selectedSeats));

    // Muestra los asientos seleccionados en la consola como confirmación
    console.log('Asientos seleccionados guardados:', this.selectedSeats);
    this.router.navigate(['/payment-card']);

  }
}
