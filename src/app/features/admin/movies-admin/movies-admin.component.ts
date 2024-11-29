import { Component, OnInit, ViewChild } from '@angular/core';
import { MovieAdmin } from './Model/MovieAdmin';
import { AddMovieModalComponent } from './add-movie-modal/add-movie-modal.component';
import { MOCK_MOVIES } from './Model/Mock/MovieAdminMock';
import {Router} from "@angular/router";
import {MovieService} from "../../../core/services/admin/movie.service";
import {ToastrService} from "ngx-toastr";
import {LoaderService} from "../../../core/services/loader.service";

@Component({
  selector: 'app-movies-admin',
  templateUrl: './movies-admin.component.html',
  styleUrls: ['./movies-admin.component.css']
})
export class MoviesAdminComponent implements OnInit {

  constructor(
    private movieService: MovieService,
    private toastr: ToastrService,
    private loader: LoaderService,

  ) {}

  @ViewChild(AddMovieModalComponent) addMovieModal!: AddMovieModalComponent; // Referencia al modal

  movies: MovieAdmin[] = [];
  selectedMovie: MovieAdmin | null = null;

  ngOnInit(): void {
    this.loadAllMovies();
  }

  addMovie(movie: MovieAdmin) {
    this.movies.push(movie); // Añadimos la película
  }

  editMovie(movie: MovieAdmin) {
    this.selectedMovie = { ...movie }; // Copia para evitar modificar directamente
    if (this.addMovieModal) {
      this.addMovieModal.movie = this.selectedMovie; // Pasamos la película al modal
      this.addMovieModal.isEditMode = true; // Activamos el modo edición
      this.addMovieModal.openModal(); // Abrimos el modal
    }
  }

  deleteMovie(movie: MovieAdmin) {
    if (confirm(`¿Estás seguro de que quieres eliminar la película "${movie.name}"?`)) {
      this.movieService.delete(movie.id).subscribe({
        next: (movieDeleted) => {
          console.log('Movie deleted successfully:', movieDeleted);
          this.loader.hide();
          this.loadAllMovies();
        },
        error: (err) => {
          console.error('Update failed:', err);
          this.toastr.error("No se pudo eliminar correctament")
          this.loader.hide();
        }
      });
    }
  }

  loadAllMovies() {
    this.loader.show(); // Show loader
    this.movieService.getAll().subscribe(
      (data) => {
        this.movies = data;
        this.loader.hide(); // Hide loader on success
      },
      (error) => {
        console.error('Error fetching movies:', error);
        this.toastr.error('Failed to load movies', 'Error');
        this.loader.hide(); // Hide loader on error
      }
    );
  }

  onModalClosed() {
    this.loadAllMovies();
  }

  loadAllMovies(){
    this.movieService.getAll().subscribe(
      (data: MovieAdmin[]) => {
        this.movies = data;
      },
      error => {
        console.error('Error al obtener las películas:', error);
        this.toastr.error('Hubo un problema al cargar las películas', 'Error');
      }
    )
  }
}
