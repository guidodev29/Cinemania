import { Component, OnInit } from '@angular/core';
import { AuthService, User } from './../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  userInfo: User | null = null;
  newPassword: string = ''; // Variable para almacenar la nueva contraseña
  showDeleteConfirmation: boolean = false;

  constructor(private authService: AuthService,private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe(
      (data: User) => {
        this.userInfo = data;
        console.log('User Info:', this.userInfo);
      },
      (error) => {
        console.error('Error fetching user info:', error);
      }
    );
  }

  // Método para modificar la contraseña
  updatePassword() {
    const userId = JSON.parse(localStorage.getItem('user_Info') || '{}').sub;

    if (!userId) {
      console.error('No se encontró el ID de usuario en el localStorage');
      return;
    }

    this.authService.updatePassword(userId, this.newPassword).subscribe(
      () => {
        this.toastr.success('Contraseña actualizada correctamente', 'Éxito');
        this.newPassword = ''; // Limpiar el campo de nueva contraseña después de actualizar
      },
      (error) => {
        console.error('Error al actualizar la contraseña:', error);
        this.toastr.error('No se pudo actualizar la contraseña', 'Error');
      }
    );
  }

  // Muestra el diálogo de confirmación para eliminar cuenta
  confirmDeleteAccount() {
    this.showDeleteConfirmation = true;
  }

  // Cancela la eliminación de la cuenta
  cancelDelete() {
    this.showDeleteConfirmation = false;
  }

  // Elimina la cuenta del usuario
  deleteAccount() {
    const userId = JSON.parse(localStorage.getItem('user_Info') || '{}').sub;

    if (!userId) {
      console.error('No se encontró el ID de usuario en el localStorage');
      return;
    }

    this.authService.deleteAccount(userId).subscribe(
      () => {
        console.log('Cuenta eliminada correctamente');
        this.showDeleteConfirmation = false;
        this.authService.logout(); // Cerrar sesión y redirigir después de eliminar la cuenta
      },
      (error) => {
        console.error('Error al eliminar la cuenta:', error);
      }
    );
  }

  // Función para redirigir al componente de mis compras
  goToPurchases() {
    this.router.navigate(['features/user/purchases']);
  }
}
