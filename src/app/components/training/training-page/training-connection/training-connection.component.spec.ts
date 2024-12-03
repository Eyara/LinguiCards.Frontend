import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingConnectionComponent } from './training-connection.component';

describe('TrainingConnectionComponent', () => {
  let component: TrainingConnectionComponent;
  let fixture: ComponentFixture<TrainingConnectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingConnectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
