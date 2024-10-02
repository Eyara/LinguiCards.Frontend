import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageOverviewComponent } from './language-overview.component';

describe('LanguageOverviewComponent', () => {
  let component: LanguageOverviewComponent;
  let fixture: ComponentFixture<LanguageOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
