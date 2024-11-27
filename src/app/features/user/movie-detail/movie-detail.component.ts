import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
})
export class MovieDetailComponent implements OnInit {
  movie: any; // Datos de la película
  showings: any[] = []; // Funciones de la película

  constructor(
    private authService: AuthService,
    public sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMovieDetails();
  }

  loadMovieDetails(): void {
    const movieId = localStorage.getItem('selectedMovieId');
    if (movieId) {
      this.authService.getMovieShowings(movieId).subscribe({
        next: (response) => {
          if (response && response.data.length > 0) {
            this.movie = response.data[0].movie;
            this.showings = response.data;
          }
        },
        error: (err) => {
          console.error('Error al cargar los detalles de la película:', err);
        },
      });
    }
  }

  openTrailerModal(): void {
    const modal = document.getElementById('trailerModal');
    if (modal) {
      modal.classList.remove('hidden'); // Muestra el modal
      const iframe = document.getElementById('trailerVideo') as HTMLIFrameElement;
      if (iframe) {
        const trailerUrl = this.convertYouTubeLink(this.movie?.trailerLink || '');
        iframe.src = trailerUrl; // Asigna el enlace transformado al iframe
      }
    }
  }

  convertYouTubeLink(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : '';
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  }


closeTrailerModal(): void {
  const modal = document.getElementById('trailerModal');
  if (modal) {
    modal.classList.add('hidden'); // Oculta el modal
    const iframe = document.getElementById('trailerVideo') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = ''; // Limpia el iframe para detener el video
    }
  }
}


reserveSeats(showingId: string, roomNumber: number): void {
  // Guarda el showingId en localStorage
  localStorage.setItem('selectedShowingId', showingId);
  console.log(`Showing ID ${showingId} guardado en localStorage`);

  // Guarda el roomNumber en localStorage
  localStorage.setItem('selectedRoomNumber', roomNumber.toString());
  console.log(`Room Number ${roomNumber} guardado en localStorage`);

  // Redirige al componente de reserva
  this.router.navigate(['/reservation']);
}
}
