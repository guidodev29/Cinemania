import { Component, ViewChild } from '@angular/core';
import { ShowingsService } from "../../../core/services/admin/showings.service";
import { ToastrService } from "ngx-toastr";
import { AddShowingModalComponent } from "./add-showing-modal/add-showing-modal.component";
import { IShowings } from "../../../core/interface/IServicesAdmins.interface";

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

  @ViewChild(AddShowingModalComponent) addShowingModal!: AddShowingModalComponent; // Referencia al modal

  showings: IShowings[] = [];
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
        console.error('Error al obtener las funciones:', error);
        this.toastr.error('Hubo un problema al cargar las funciones', 'Error');
      }
    );
  }

  // Método para abrir el modal del componente hijo
  openAddShowingModal(): void {
    if (this.addShowingModal) {
      this.addShowingModal.openModal(); // Abre el modal del componente hijo
    }
  }

  addShowing(showing: IShowings): void {
    this.showings.push(showing); // Añade la función a la lista
    this.toastr.success('La función fue agregada exitosamente', 'Éxito');
  }
}
