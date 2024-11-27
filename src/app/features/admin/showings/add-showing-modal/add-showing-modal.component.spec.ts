import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShowingModalComponent } from './add-showing-modal.component';

describe('AddShowingModalComponent', () => {
  let component: AddShowingModalComponent;
  let fixture: ComponentFixture<AddShowingModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddShowingModalComponent]
    });
    fixture = TestBed.createComponent(AddShowingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
