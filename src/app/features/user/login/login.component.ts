import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.loginAndSaveSession({ email, password }).subscribe(
        response => {
          console.log('Sign in correct:', response);
          this.toastr.success('Inicio de sesión exitoso', '¡Éxito!'); // Muestra la alerta de éxito
          this.router.navigate(['/home']); // Redirige al usuario después de iniciar sesión
        },
        error => {
          console.error('Sign In Failed due to:', error);
          this.toastr.error('Hubo un problema al iniciar sesión', 'Error'); // Muestra la alerta de error
        }
      );
    } else {
      console.error('Form is invalid');
      console.log('Email errors:', this.loginForm.get('email')?.errors);
      console.log('Password errors:', this.loginForm.get('password')?.errors);
      this.toastr.error('El formulario es inválido', 'Error'); // Muestra alerta de formulario inválido
    }
  }
}
