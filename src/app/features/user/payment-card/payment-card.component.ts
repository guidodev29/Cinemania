import { Component } from '@angular/core';

@Component({
  selector: 'app-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.css']
})
export class PaymentCardComponent {
  payment = {
    cardName: '',
    cardNumber: '',
    expiration: '',
    cvv: ''
  };

  processPayment() {
    // Validación de campos vacíos
    if (!this.payment.cardName || !this.payment.cardNumber || !this.payment.expiration || !this.payment.cvv) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Guardar en Local Storage
    localStorage.setItem('paymentDetails', JSON.stringify(this.payment));
    alert('¡Reserva completada con éxito! Los datos se han guardado.');

    // Resetear el formulario
    this.payment = { cardName: '', cardNumber: '', expiration: '', cvv: '' };
  }
}
