import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.css'],
})
export class PaymentCardComponent {
  paymentForm: FormGroup;
  cardNumberInvalid: boolean = false;
  showProcessingModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Inicializar el formulario
    this.paymentForm = this.fb.group({
      cardHolder: ['', [Validators.required]],
      cardNumber: ['', [Validators.required, this.validateCardNumber.bind(this)]],
      expirationDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
    });
  }

  // Validación del número de tarjeta con algoritmo de Luhn
  validateCardNumber(control: any): { [key: string]: boolean } | null {
    const cardNumber = control.value.replace(/\s+/g, ''); // Eliminar espacios
    if (!this.isValidCardNumber(cardNumber)) {
      this.cardNumberInvalid = true;
      return { invalidCardNumber: true };
    }
    this.cardNumberInvalid = false;
    return null;
  }

  private isValidCardNumber(cardNumber: string): boolean {
    let sum = 0;
    let shouldDouble = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  }

  // Confirmar la reserva y procesar el pago
  confirmReservation(): void {
    // Mostrar el modal de validación
    const modal = document.getElementById('paymentProcessingModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('block');
  }

    // Recuperar datos del localStorage
    const userId = JSON.parse(localStorage.getItem('user_Info') || '{}')?.sub; // Asumiendo que el ID del usuario está en `sub`
    const showingId = localStorage.getItem('selectedShowingId');
    const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats') || '[]');

    if (!userId || !showingId || selectedSeats.length === 0) {
      this.showProcessingModal = false; // Cerrar modal si hay error
      alert('Faltan datos para completar la reserva. Por favor, verifica tu selección.');
      return;
    }

    // Construir el cuerpo del POST
    const reservationPayload = {
      userId: userId,
      showingId: showingId,
      seats: selectedSeats.map((seat: any) => ({
        id: seat.id,
        seatType: seat.seatType,
        status: seat.status,
        roomNumber: seat.roomNumber,
        row: seat.row,
        seatNumber: seat.seatNumber,
      })),
    };

    // Mostrar el cuerpo en consola para depuración
    console.log('Payload enviado al endpoint de reserva:', reservationPayload);

    // Enviar la solicitud al endpoint
    this.authService.createReservation(reservationPayload).subscribe({
      next: (response) => {
        console.log('Reserva creada exitosamente:', response);
        if (response?.data?.reservationId) {
          // Guardar el reservationId en localStorage
          localStorage.setItem('reservationId', response.data.reservationId);

          // Redirigir al recibo
          this.router.navigate(['features/user/receipt']);
        }
        this.showProcessingModal = false; // Cerrar el modal
      },
      error: (err) => {
        console.error('Error al crear la reserva:', err);
        this.showProcessingModal = false; // Cerrar el modal
        alert('Ocurrió un error al procesar tu reserva. Por favor, inténtalo de nuevo.');
      },
    });
  }
}
