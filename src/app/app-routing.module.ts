import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

import { RegisterComponent } from './features/user/register/register.component';
import { LoginComponent } from './features/user/login/login.component';
import { LandingComponent } from './shared/landing/landing.component';
import { HomeComponent } from './features/user/home/home.component';
import { AccountComponent } from './features/user/account/account.component';
import { ReservationComponent } from './features/user/reservation/reservation.component';
import { PaymentCardComponent } from './features/user/payment-card/payment-card.component';
import { ReservationAdminComponent } from "./features/admin/reservation-admin/reservation-admin.component";
import { MoviesAdminComponent } from "./features/admin/movies-admin/movies-admin.component";

const routes: Routes = [
  { path: 'payment-card', component: PaymentCardComponent, canActivate: [AuthGuard]},
  { path: 'reservation', component: ReservationComponent, canActivate: [AuthGuard]},
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: '', component: LandingComponent},
  { path: 'reservationAdmin', component: ReservationAdminComponent},
  { path: 'moviesAdmin', component: MoviesAdminComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }