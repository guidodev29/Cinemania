import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css']
})
export class PurchasesComponent implements OnInit {
  reservations: any[] = [];
  userId: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const userId = JSON.parse(localStorage.getItem('user_Info') || '{}').sub;

    if (!userId) {
      console.error('No se encontró el ID de usuario en el localStorage');
      return;
    }
    // Si el userId está en formato string simple
    if (userId) {
      this.userId = userId; // Usar directamente si es un string
      this.getReservations();
    } else {
      console.error('userId no encontrado en localStorage');
    }
  }


  getReservations(): void {
    this.authService.getReservationsByUserId(this.userId).subscribe({
      next: (data) => {
        console.log('Data recibida:', data); // Verifica qué datos estás recibiendo
        this.reservations = data.data?.reservation || [];
      },
      error: (err) => {
        console.error('Error al obtener reservas', err);
      }
    });
  }


}
