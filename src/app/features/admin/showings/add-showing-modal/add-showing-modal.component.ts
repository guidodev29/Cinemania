import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ShowingsService } from "../../../../core/services/admin/showings.service";
import {IShowings, IRooms, IShowingDates, IUpdateShowing} from "../../../../core/interface/IServicesAdmins.interface";
import {MovieAdmin} from "../../movies-admin/Model/MovieAdmin";
import {LoaderService} from "../../../../core/services/loader.service";
import {ToastrService} from "ngx-toastr";
import {MovieService} from "../../../../core/services/admin/movie.service";
import {RoomsService} from "../../../../core/services/admin/rooms.service";
import {ShowingDatesService} from "../../../../core/services/admin/showing-dates.service";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-add-showing-modal',
  templateUrl: './add-showing-modal.component.html',
  styleUrls: ['./add-showing-modal.component.css']
})
export class AddShowingModalComponent implements OnInit {
  @Input() showing: IShowings = this.getDefaultShowing();
  @Input() isEditMode: boolean = false;
  @Output() showingAdded = new EventEmitter<IShowings>();
  @Output() showingEdited = new EventEmitter<IShowings>();
  @Output() modalClosed = new EventEmitter<void>();

  isOpen = false; // Controla la visibilidad del modal
  rooms: IRooms[] = [];
  movies: MovieAdmin[] = []
  showingDates: IShowingDates[] = []


  constructor(
    private showingsService: ShowingsService,
    private movieService: MovieService,
    private roomsService: RoomsService,
    private showingDatesService: ShowingDatesService,
    private loader: LoaderService,
    private toaster: ToastrService,

  ) {}

  ngOnInit(): void {
    this.setup()
  }


  private loadRooms(): void {
    this.rooms = [
      { id: '1', roomNumber: 1, capacity: 100, type: 'Standard' },
      { id: '2', roomNumber: 2, capacity: 50, type: 'IMAX' }
    ];
  }

  private getDefaultShowing(): IShowings {
    return {
      id: '',
      room: { id: '', roomNumber: 0, capacity: 36, type: '' },
      movie: { id: '', name: '', description: '', director: '', trailerLink: '', duration: '', imageLink: '', language: '', classification: '' },
      showingDate: '',
      startTime: '',
      endTime: ''
    };
  }

  openModal(): void {
    this.isOpen = true; // Abre el modal
  }

  closeModal(): void {
    this.isOpen = false; // Cierra el modal
    this.showing = this.getDefaultShowing();
    this.isEditMode = false;
  }

  submitForm(): void {
    // Expresión regular para validar el formato HH:mm:ss
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

    // Validar el formato de la hora de inicio
    if (!timePattern.test(this.showing.startTime)) {
      this.toaster.error('La hora de inicio debe estar en el formato HH:mm:ss (e.g., 17:00:00).', 'Error');
      return; // Detenemos la ejecución si el formato es inválido
    }

    if (this.isEditMode) {
      // Find the selected showing date and its corresponding ID
      const selectedShowingDate = this.showingDates.find(
        (date) => date.showingDate === this.showing.showingDate
      );

      if (!selectedShowingDate) {
        this.toaster.error('La fecha seleccionada no es válida.', 'Error');
        return;
      }

      // Construct the update body
      const updatedShowing: IUpdateShowing = {
        roomId: this.showing.room.id, // Use only the ID for the room
        movieId: this.showing.movie.id, // Use only the ID for the movie
        showtimeId: selectedShowingDate.id, // Use the selected showingDate's ID
        startTime: this.showing.startTime // Directly use startTime
      };

      this.loader.show(); // Show loader during the update process

      this.showingsService.put(this.showing.id, updatedShowing).subscribe({
        next: (updated) => {
          this.toaster.success('Función actualizada correctamente.', 'Éxito');
          this.showingEdited.emit(updated);
          this.modalClosed.emit();// Emit the updated showing to parent
          this.closeModal();
        },
        error: (err) => {
          console.error('Error updating showing:', err);
          this.loader.hide();
          this.toaster.error('Hubo un problema al actualizar la función.', 'Error');
        },
        complete: () => {
          this.loader.hide(); // Hide loader after the operation is complete
        },
      });
    } else {
      // Adding a new showing
      const selectedShowingDate = this.showingDates.find(
        (date) => date.showingDate === this.showing.showingDate
      );

      if (!selectedShowingDate) {
        this.toaster.error('La fecha seleccionada no es válida.', 'Error');
        return;
      }

      const newShowing = {
        roomId: this.showing.room.id,
        movieId: this.showing.movie.id,
        showtimeId: selectedShowingDate.id,
        startTime: this.showing.startTime
      };

      this.loader.show();

      this.showingsService.post(newShowing).subscribe({
        next: (created) => {
          this.toaster.success('Función agregada correctamente.', 'Éxito');
          this.modalClosed.emit();
          this.closeModal();
          this.modalClosed.emit();
        },
        error: (err) => {
          console.error('Error creating showing:', err);
          this.toaster.error('Hubo un problema al agregar la función.', 'Error');
        },
        complete: () => {
          this.loader.hide();
        },
      });
    }
    this.closeModal();
  }

  private setup() {
    this.loader.show(); // Show loader before making API calls

    forkJoin({
      movies: this.movieService.getAll(),
      rooms: this.roomsService.getAll(),
      showingDates: this.showingDatesService.getAll(),
    }).subscribe({
      next: (results) => {
        // Assign results to their respective variables
        this.movies = results.movies;
        this.rooms = results.rooms;
        this.showingDates = results.showingDates;

        this.loader.hide(); // Hide loader on success

        console.log(results);
      },
      error: (err) => {
        console.error('Error fetching data:', err);

        // Display appropriate error messages
        this.toaster.error('Hubo un problema al cargar los datos.', 'Error');

        this.loader.hide(); // Hide loader on error
      },
    });
  }
}
