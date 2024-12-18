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
import { ReservationAdminComponent } from './features/admin/reservation-admin/reservation-admin.component';
import {LoginAdminComponent} from "./features/admin/login/login-admin.component";
import {HomeAdminComponent} from "./features/admin/home/home-admin.component";
import { MoviesAdminComponent } from './features/admin/movies-admin/movies-admin.component';
import { AddMovieModalComponent } from './features/admin/movies-admin/add-movie-modal/add-movie-modal.component';
import { ShowingsComponent } from './features/admin/showings/showings.component';
import { AddShowingModalComponent } from './features/admin/showings/add-showing-modal/add-showing-modal.component';
import { MovieDetailComponent } from './features/user/movie-detail/movie-detail.component';
import { SafeUrlPipe } from './shared/pipes/safe-url.pipe';
import { SummaryComponent } from './features/user/summary/summary.component';
import { ReceiptComponent } from './features/user/receipt/receipt.component';
import { SidebarComponent } from './features/admin/sidebar/sidebar.component';
import { PurchasesComponent } from './features/user/purchases/purchases.component';


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
    ReservationAdminComponent,
    MoviesAdminComponent,
    AddMovieModalComponent,
    ShowingsComponent,
    AddShowingModalComponent,
    MovieDetailComponent,
    SafeUrlPipe,
    SummaryComponent,
    ReceiptComponent,
    LoginAdminComponent,
    HomeAdminComponent,
    SidebarComponent,
    PurchasesComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    CommonModule,
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
