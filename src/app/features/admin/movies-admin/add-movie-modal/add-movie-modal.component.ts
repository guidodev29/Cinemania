import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { MovieAdmin } from "../Model/MovieAdmin";
import { ClasificationAdmin } from "./Model/ClasificationAdmin";
import { LanguageAdmin } from "./Model/LanguageAdmin";
import { MOCK_CLASIFICATION } from "./Model/Mock/ClasificationAdminMock";
import { MOCK_LANGUAGE } from "./Model/Mock/LanguageAdminMock";
import {ClassificationsService} from "../../../../core/services/admin/classifications.service";
import {LanguagesService} from "../../../../core/services/admin/languages.service";
import {MovieService} from "../../../../core/services/admin/movie.service";
import {ToastrService} from "ngx-toastr";
import {LoaderService} from "../../../../core/services/loader.service";

@Component({
  selector: 'app-add-movie-modal',
  templateUrl: './add-movie-modal.component.html',
  styleUrls: ['./add-movie-modal.component.css']
})
export class AddMovieModalComponent implements OnInit {

  constructor(
    private classificationsService: ClassificationsService,
    private languagesService: LanguagesService,
    private moviesService: MovieService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {
  }
  @Input() movie: MovieAdmin = this.getDefaultMovie(); // Película seleccionada para editar o valores predeterminados
  @Input() isEditMode: boolean = false; // Indica si el formulario está en modo de edición o adición
  @Output() movieAdded = new EventEmitter<MovieAdmin>(); // Emite el objeto MovieAdmin cuando la película se agrega
  @Output() movieEdited = new EventEmitter<MovieAdmin>(); // Emite el objeto MovieAdmin cuando la película se edita
  @Output() modalClosed = new EventEmitter<void>();

  isOpen = false; // Controla la visibilidad del modal
  clasification: ClasificationAdmin[] = [];
  languages: LanguageAdmin[] = [];

  ngOnInit(): void {
    this.loadClassifications();
    this.loadLanguages();

  }


  private loadClassifications(): void {
    this.classificationsService.getAll().subscribe(
      (data: ClasificationAdmin[]) => {
        this.clasification = data;
        console.log(this.clasification);
      },
      error => {
        console.error('Error al cargar las clasificaciones:', error);
        // Aquí podrías mostrar algún mensaje de error en el UI, o usar un valor por defecto.
      }
    );
  }

  private loadLanguages(): void {
    this.languagesService.getAll().subscribe(
      (data: LanguageAdmin[]) => {
        this.languages = data;
        console.log(this.languages);
      },
      error => {
        console.error('Error al cargar los idiomas:', error);
        // Similar a las clasificaciones, manejar el error apropiadamente.
      }
    );
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

    // Set classification based on the prefix
    const selectedClassification = this.clasification.find(
      (clasif) => clasif.prefix === this.movie.classification
    );
    this.movie.classification = selectedClassification ? selectedClassification.id : '';

    // Set language based on the name
    const selectedLanguage = this.languages.find(
      (lang) => lang.prefix === this.movie.language
    );
    this.movie.language = selectedLanguage ? selectedLanguage.id : '';
  }

  closeModal() {
    this.isOpen = false;
    this.movie = this.getDefaultMovie(); // Restablece los valores del formulario
    this.isEditMode = false; // Resetea el modo al cerrar el modal
    this.modalClosed.emit();
  }

  submitForm() {
    // Convertimos los valores de `id` a `prefix` para clasificaciones e idiomas
    const matchedLanguage = this.languages.find(lang => lang.id === this.movie.language);
    const matchedClassification = this.clasification.find(clas => clas.id === this.movie.classification);

    const durationRegex = /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/; // Regex para HH:MM:SS

    const requiredFields = [
      this.movie.name,
      this.movie.imageLink,
      this.movie.description,
      this.movie.director,
      this.movie.trailerLink,
      this.movie.duration,
      this.movie.language,
      this.movie.classification
    ];

    const areAllFieldsFilled = requiredFields.every(field => !!field?.trim());
    const isDurationValid = durationRegex.test(this.movie.duration); // Validar formato de duración

    if (!areAllFieldsFilled) {
      console.error('All fields must be filled!');
      this.toastr.error('Todos los campos son obligatorios.', 'Error');
      return;
    }

    if (!isDurationValid) {
      console.error('Invalid duration format!');
      this.toastr.error('La duración debe tener el formato HH:MM:SS.', 'Error');
      return;
    }


    if (this.isEditMode) {
      const updatedMovie: MovieAdmin = {
        id: this.movie.id,
        name: this.movie.name,
        imageLink: this.movie.imageLink,
        description: this.movie.description,
        director: this.movie.director,
        trailerLink: this.movie.trailerLink,
        duration: this.movie.duration,
        language: this.movie.language,
        classification: this.movie.classification
      };

      this.loader.show();
      this.moviesService.updateMovie(updatedMovie).subscribe({
        next: (updatedMovie) => {
          console.log('Movie updated successfully:', updatedMovie);
          this.closeModal();
          this.loader.hide();
        },
        error: (err) => {
          console.error('Update failed:', err);
          this.toastr.error("algo fallo en la actualización")
          this.loader.hide();
        }
      });
    } else {
      const newMovie: MovieAdmin = {
        id: this.movie.id,
        name: this.movie.name,
        imageLink: this.movie.imageLink,
        description: this.movie.description,
        director: this.movie.director,
        trailerLink: this.movie.trailerLink,
        duration: this.movie.duration,
        language: this.movie.language,
        classification: this.movie.classification
      };

      this.loader.show()
      this.moviesService.addMovie(newMovie).subscribe({
        next: (updatedMovie) => {
          console.log('Movie created successfully:', updatedMovie);
          this.loader.hide();
          this.closeModal();
        },
        error: (err) => {
          console.error('Update failed:', err);
          this.toastr.error("algo fallo en la creación")
          this.loader.hide();
        }
      });
    }
  }
}
