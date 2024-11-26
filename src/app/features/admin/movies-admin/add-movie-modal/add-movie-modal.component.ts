import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { MovieAdmin } from "../Model/MovieAdmin";
import { ClasificationAdmin } from "./Model/ClasificationAdmin";
import { LanguageAdmin } from "./Model/LanguageAdmin";
import { MOCK_CLASIFICATION } from "./Model/Mock/ClasificationAdminMock";
import { MOCK_LANGUAGE } from "./Model/Mock/LanguageAdminMock";

@Component({
  selector: 'app-add-movie-modal',
  templateUrl: './add-movie-modal.component.html',
  styleUrls: ['./add-movie-modal.component.css']
})
export class AddMovieModalComponent implements OnInit {
  @Input() movie: MovieAdmin = this.getDefaultMovie(); // Película seleccionada para editar o valores predeterminados
  @Input() isEditMode: boolean = false; // Indica si el formulario está en modo de edición o adición
  @Output() movieAdded = new EventEmitter<MovieAdmin>(); // Emite el objeto MovieAdmin cuando la película se agrega
  @Output() movieEdited = new EventEmitter<MovieAdmin>(); // Emite el objeto MovieAdmin cuando la película se edita

  isOpen = false; // Controla la visibilidad del modal
  clasification: ClasificationAdmin[] = [];
  languages: LanguageAdmin[] = [];

  ngOnInit(): void {
    this.clasification = MOCK_CLASIFICATION;
    this.languages = MOCK_LANGUAGE;
  }

  private getDefaultMovie(): MovieAdmin {
    return {
      id: '',
      name: '',
      description: '',
      director: '',
      trailerLink: '',
      duration: '',
      imageLink: '',
      language: 'Español',
      classification: 'G',
    };
  }

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
    this.movie = this.getDefaultMovie(); // Restablece los valores del formulario
    this.isEditMode = false; // Resetea el modo al cerrar el modal
  }

  submitForm() {
    // Convertimos los valores de `id` a `prefix` para clasificaciones e idiomas
    const matchedLanguage = this.languages.find(lang => lang.id === this.movie.language);
    const matchedClassification = this.clasification.find(clas => clas.id === this.movie.classification);

    const movieToEmit = {
      ...this.movie,
      language: matchedLanguage ? matchedLanguage.prefix : this.movie.language,
      classification: matchedClassification ? matchedClassification.prefix : this.movie.classification
    };

    if (this.isEditMode) {
      this.movieEdited.emit(movieToEmit); // Emitimos la película editada
    } else {
      this.movieAdded.emit(movieToEmit); // Emitimos la película agregada
    }
    this.closeModal();
  }
}
