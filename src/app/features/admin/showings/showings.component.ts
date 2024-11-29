import {Component, ViewChild} from '@angular/core';
import {ShowingsService} from "../../../core/services/admin/showings.service";
import {ToastrService} from "ngx-toastr";
import {AddShowingModalComponent} from "./add-showing-modal/add-showing-modal.component";
import {IShowings} from "../../../core/interface/IServicesAdmins.interface";
import {MovieAdmin} from "../movies-admin/Model/MovieAdmin";

@Component({
  selector: 'app-showings',
  templateUrl: './showings.component.html',
  styleUrls: ['./showings.component.css']
})
export class ShowingsComponent {
  constructor(
    private showingService: ShowingsService,
    private toastr: ToastrService

  ) {}

  @ViewChild(AddShowingModalComponent) addMovieModal!: AddShowingModalComponent; // Referencia al modal

  showings: IShowings[] = []
  selectShowing: IShowings | null = null;

  ngOnInit(): void {
    this.loadAllShowings();
  }


  loadAllShowings(): void {
    this.showingService.getAll().subscribe(
      (data: IShowings[]) => {
        this.showings = data;
      },
      error => {
        console.error('Error al obtener las películas:', error);
        this.toastr.error('Hubo un problema al cargar las películas', 'Error');
      }
    )
  }

  addMovie(movie: IShowings) {
    this.showings.push(movie); // Añadimos la película
  }

  deleteShowing(id: string) {
    this.showingService.delete(id).subscribe()
  }

  // editMovie(movie: IShowings) {
  //   this.selectShowing = { ...movie }; // Copia para evitar modificar directamente
  //   if (this.addMovieModal) {
  //     this.addMovieModal.showings = this.selectShowing; // Pasamos la película al modal
  //     this.addMovieModal.isEditMode = true; // Activamos el modo edición
  //     this.addMovieModal.openModal(); // Abrimos el modal
  //   }
  // }



}
