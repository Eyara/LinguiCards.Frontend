import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrammarPageComponent } from './grammar-page.component';

describe('GrammarPageComponent', () => {
  let component: GrammarPageComponent;
  let fixture: ComponentFixture<GrammarPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrammarPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrammarPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
