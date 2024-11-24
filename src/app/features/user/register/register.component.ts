import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Importamos el servicio
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { firstName, lastName, email, password, confirmPassword } = this.registerForm.value;

      if (password !== confirmPassword) {
        console.error('Las contraseñas no coinciden');
        return;
      }

      this.authService.register({ firstName, lastName, email, password }).subscribe(
        response => {
          console.log('User registered successfully:', response);
        },
        error => {
          console.error('User registration failed:', error);
        }
      );
    } else {
      console.error('Form is invalid');
      console.log('First Name errors:', this.registerForm.get('firstName')?.errors);
      console.log('Last Name errors:', this.registerForm.get('lastName')?.errors);
      console.log('Email errors:', this.registerForm.get('email')?.errors);
      console.log('Password errors:', this.registerForm.get('password')?.errors);
      console.log('Confirm Password errors:', this.registerForm.get('confirmPassword')?.errors);
    }
  }
}
