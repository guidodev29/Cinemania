import { Component, OnInit, ViewChild } from '@angular/core';
import { MovieAdmin } from './Model/MovieAdmin';
import { AddMovieModalComponent } from './add-movie-modal/add-movie-modal.component';
import { MOCK_MOVIES } from './Model/Mock/MovieAdminMock';
import {LanguageAdmin} from "./add-movie-modal/Model/LanguageAdmin";
import {ClasificationAdmin} from "./add-movie-modal/Model/ClasificationAdmin";
import {MOCK_LANGUAGE} from "./add-movie-modal/Model/Mock/LanguageAdminMock";
import {MOCK_CLASIFICATION} from "./add-movie-modal/Model/Mock/ClasificationAdminMock";

@Component({
  selector: 'app-movies-admin',
  templateUrl: './movies-admin.component.html',
  styleUrls: ['./movies-admin.component.css']
})
export class MoviesAdminComponent implements OnInit {
  @ViewChild(AddMovieModalComponent) addMovieModal!: AddMovieModalComponent; // Referencia al modal

  movies: MovieAdmin[] = [];
  selectedMovie: MovieAdmin | null = null;

  ngOnInit(): void {
    this.movies = MOCK_MOVIES;
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

  updateMovie(movie: MovieAdmin) {
    const index = this.movies.findIndex(m => m.id === movie.id);
    if (index !== -1) {
      this.movies[index] = movie; // Actualizamos la película
    }
  }

  deleteMovie(movie: MovieAdmin) {
    if (confirm(`¿Estás seguro de que quieres eliminar la película "${movie.name}"?`)) {
      this.movies = this.movies.filter(m => m.id !== movie.id);
    }
  }
}
