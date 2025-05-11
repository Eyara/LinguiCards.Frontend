import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationPracticeComponent } from './translation-practice.component';

describe('TranslationPracticeComponent', () => {
  let component: TranslationPracticeComponent;
  let fixture: ComponentFixture<TranslationPracticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslationPracticeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranslationPracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
