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
  @ViewChild(AddShowingModalComponent) addShowingModal!: AddShowingModalComponent;

  showings: IShowings[] = [];

  constructor(
    private showingService: ShowingsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAllShowings();
  }

  loadAllShowings(): void {
    this.showingService.getAll().subscribe(
      (data: IShowings[]) => (this.showings = data),
      (error) => {
        console.error('Error al obtener las funciones:', error);
        this.toastr.error('Hubo un problema al cargar las funciones', 'Error');
      }
    );
  }

  openAddShowingModal(): void {
    this.addShowingModal.openModal();
  }

  editShowing(showing: IShowings): void {
    this.addShowingModal.showing = { ...showing };
    this.addShowingModal.isEditMode = true;
    this.addShowingModal.openModal();
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

  onDelete(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
      console.log(`Elemento con ID ${id} eliminado.`);
    }
  }
}
