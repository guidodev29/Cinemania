import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { RegisterComponent } from './features/user/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';


import { NavbarComponent } from './shared/navbar/navbar.component';
import { LoginComponent } from './features/user/login/login.component';
import { FooterComponent } from './shared/footer/footer.component';
import { LandingComponent } from './shared/landing/landing.component';
import { HomeComponent } from './features/user/home/home.component';
import { AccountComponent } from './features/user/account/account.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { ReservationComponent } from './features/user/reservation/reservation.component';
import { PaymentCardComponent } from './features/user/payment-card/payment-card.component';
import {LoginAdminComponent} from "./features/admin/login/login-admin.component";


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    NavbarComponent,
    LoginComponent,
    FooterComponent,
    LandingComponent,
    HomeComponent,
    AccountComponent,
    LoaderComponent,
    ReservationComponent,
    PaymentCardComponent,
    LoginAdminComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot()
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
