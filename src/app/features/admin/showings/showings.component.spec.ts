import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowingsComponent } from './showings.component';

describe('ShowingsComponent', () => {
  let component: ShowingsComponent;
  let fixture: ComponentFixture<ShowingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowingsComponent]
    });
    fixture = TestBed.createComponent(ShowingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
