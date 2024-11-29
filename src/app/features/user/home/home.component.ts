import { compileNgModule } from '@angular/compiler';
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  movies: any[] = [];
  autoCarouselSlide = 0;
  autoSlideInterval: any;
  selectedMovie: any = null; // Película seleccionada para el modal

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.startAutoCarousel();
    this.authService.cleanLocal();
    this.authService.getMovies().subscribe({
      next: (response) => {
        console.log(response);
        this.movies = response.data;
      },
      error: (err) => {
        console.error('Error al cargar las películas:', err);
      },
    });
  }


  startAutoCarousel(): void {
    // Inicia un intervalo para cambiar automáticamente las imágenes
    this.autoSlideInterval = setInterval(() => {
      this.nextSlideAuto();
    }, 3000); // Cambia cada 3 segundos
  }

  nextSlideAuto(): void {
    // Asegura que solo recorra las 3 imágenes
    if (this.autoCarouselSlide >= 2) {
      this.autoCarouselSlide = 0; // Reinicia al primer slide
    } else {
      this.autoCarouselSlide++; // Avanza al siguiente slide
    }
  }


  scrollCarousel(direction: 'next' | 'prev'): void {
    const carousel = document.getElementById('movieCarousel');
    if (carousel) {
      const scrollAmount = 300; // Ajusta este valor para controlar el desplazamiento
      if (direction === 'next') {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else if (direction === 'prev') {
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  }

  goToPreviousSlide(): void {
    this.scrollCarousel('prev');
  }

  goToNextSlide(): void {
    this.scrollCarousel('next');
  }

  confirmSelection(): void {
    if (this.selectedMovie) {
      localStorage.setItem('selectedMovieId', this.selectedMovie.id);
      localStorage.setItem('selectedMovieName', this.selectedMovie.name);
      console.log('Pelicula seleccionada: ' + localStorage.getItem('selectedMovieId'));
      this.router.navigate(['features/user/movie-detail']);
    } else {
      console.error('No se ha seleccionado una película.');
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.autoSlideInterval);
  }

  logOut() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_Info');
    this.router.navigate(['/']);
  }
}
