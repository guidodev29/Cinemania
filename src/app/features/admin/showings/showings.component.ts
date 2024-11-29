import { Component, ViewChild } from '@angular/core';
import { ShowingsService } from "../../../core/services/admin/showings.service";
import { ToastrService } from "ngx-toastr";
import { AddShowingModalComponent } from "./add-showing-modal/add-showing-modal.component";
import {IRooms, IShowingDates, IShowings} from "../../../core/interface/IServicesAdmins.interface";
import {LoaderService} from "../../../core/services/loader.service";
import {MovieAdmin} from "../movies-admin/Model/MovieAdmin";
import {MovieService} from "../../../core/services/admin/movie.service";
import {RoomsService} from "../../../core/services/admin/rooms.service";
import {forkJoin} from "rxjs";
import {ShowingDatesService} from "../../../core/services/admin/showing-dates.service";

@Component({
  selector: 'app-showings',
  templateUrl: './showings.component.html',
  styleUrls: ['./showings.component.css']
})
export class ShowingsComponent {
  @ViewChild(AddShowingModalComponent) addShowingModal!: AddShowingModalComponent;

  showings: IShowings[] = [];
  rooms: IRooms[] = [];
  movies: MovieAdmin[] = [];
  showingDates: IShowingDates[] = [];


  constructor(
    private showingService: ShowingsService,
    private toastr: ToastrService,
    private loader: LoaderService,
    private movieService: MovieService,
    private roomsService: RoomsService,
    private showingDatesService: ShowingDatesService
  ) {}

  ngOnInit(): void {
    this.setup();
  }

  loadAllShowings(): void {
    this.loader.show();
    this.showingService.getAll().subscribe(
      (data) => {
        this.showings = data;
        this.loader.hide(); // Hide loader on success
        console.log(this.showings)
      },
      (error) => {
        console.error('Error fetching movies:', error);
        this.toastr.error('Hubo un problema al cargar las funciones', 'Error');
        this.loader.hide(); // Hide loader on error
      }
    );
  }



  openAddShowingModal(): void {
    this.addShowingModal.openModal();
  }

  editShowing(showing: IShowings): void {
    if (this.addShowingModal) {
      // Map room from rooms array
      const selectedRoom = this.rooms.find((room) => room.roomNumber === showing.room.roomNumber);
      const selectedMovie = this.movies.find((movie) => movie.id === showing.movie.id);
      const selectedDate = this.showingDates.find((date) => date.showingDate === showing.showingDate);

      console.log(`date showing: ${showing.showingDate}`)
      console.log(`date selected: ${selectedDate?.showingDate}`);

      // Prepare the showing object with proper mappings
      this.addShowingModal.showing = {
        ...showing,
        room: selectedRoom || showing.room,
        showingDate: selectedDate?.showingDate || showing.showingDate,
        movie: selectedMovie || showing.movie, // Use existing movie if no match is found
      };

      // Set edit mode and open the modal
      this.addShowingModal.isEditMode = true;
      this.addShowingModal.openModal();
    }
  }

  addShowing(showing: IShowings): void {
    this.showings.push(showing);
    this.toastr.success('La función fue agregada exitosamente', 'Éxito');
  }

  updateShowing(updatedShowing: IShowings): void {
    const index = this.showings.findIndex((s) => s.id === updatedShowing.id);
    if (index !== -1) {
      this.showings[index] = updatedShowing;
      this.toastr.success('La función fue actualizada exitosamente', 'Éxito');
    }
  }

  onDelete(showing: IShowings): void {
    if (confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
      this.showingService.delete(showing.id).subscribe({
        next: (movieDeleted) => {
          console.log('Movie deleted successfully:', movieDeleted);
          this.loader.hide();
          this.setup();
        },
        error: (err) => {
          console.error('Update failed:', err);
          this.toastr.error("No se pudo eliminar correctament")
          this.loader.hide();
        }
      });
    }
  }

  private setup() {
    this.loader.show(); // Show loader before making API calls

    forkJoin({
      showings: this.showingService.getAll(),
      movies: this.movieService.getAll(),
      rooms: this.roomsService.getAll(),
      showingDates: this.showingDatesService.getAll(),
    }).subscribe({
      next: (results) => {
        // Assign results to their respective variables
        this.showings = results.showings;
        this.movies = results.movies;
        this.rooms = results.rooms;
        this.showingDates = results.showingDates;

        this.loader.hide(); // Hide loader on success
        console.log('Data fetched successfully:', results);
      },
      error: (err) => {
        console.error('Error fetching data:', err);

        // Display appropriate error messages
        this.toastr.error('Hubo un problema al cargar la información.', 'Error');

        this.loader.hide(); // Hide loader on error
      },
    });
  }

  onModalClosed() {
    this.setup()
  }
}
