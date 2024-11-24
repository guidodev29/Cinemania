import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  isMenuOpen = false;
  private authSubscription!: Subscription;

  constructor(private authService: AuthService){}

  ngOnInit(){
    // Suscríbete al estado de autenticación
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      }
    );
  }

  ngOnDestroy() {
    // Desuscríbete para evitar fugas de memoria
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  // Método para cerrar sesión
  logout() {
    this.authService.logout();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    // Opcional: Prevenir scroll cuando el menú está abierto
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }
}
