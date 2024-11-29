import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClassificationsService } from "../../../../core/services/admin/classifications.service";
import { LanguagesService } from "../../../../core/services/admin/languages.service";
import { ShowingsService } from "../../../../core/services/admin/showings.service";
import { ClasificationAdmin } from "../../movies-admin/add-movie-modal/Model/ClasificationAdmin";
import { LanguageAdmin } from "../../movies-admin/add-movie-modal/Model/LanguageAdmin";
import { IShowings, IRooms } from "../../../../core/interface/IServicesAdmins.interface";

@Component({
  selector: 'app-add-showing-modal',
  templateUrl: './add-showing-modal.component.html',
  styleUrls: ['./add-showing-modal.component.css']
})
export class AddShowingModalComponent {
  @Input() showing: IShowings = this.getDefaultShowing();
  @Input() isEditMode: boolean = false;
  @Output() showingAdded = new EventEmitter<IShowings>();
  @Output() showingEdited = new EventEmitter<IShowings>();

  isOpen = false; // Controla la visibilidad del modal
  classifications: ClasificationAdmin[] = [];
  languages: LanguageAdmin[] = [];
  rooms: IRooms[] = [];

  constructor(
    private classificationsService: ClassificationsService,
    private languagesService: LanguagesService,
    private showingsService: ShowingsService
  ) {}

  ngOnInit(): void {
    this.loadClassifications();
    this.loadLanguages();
    this.loadRooms();
  }

  private loadClassifications(): void {
    this.classificationsService.getAll().subscribe(
      (data: ClasificationAdmin[]) => (this.classifications = data),
      (error) => console.error('Error al cargar las clasificaciones:', error)
    );
  }

  private loadLanguages(): void {
    this.languagesService.getAll().subscribe(
      (data: LanguageAdmin[]) => (this.languages = data),
      (error) => console.error('Error al cargar los idiomas:', error)
    );
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
    if (this.isEditMode) {
      this.showingEdited.emit(this.showing);
    } else {
      this.showingAdded.emit(this.showing);
    }
    this.closeModal();
  }
}
