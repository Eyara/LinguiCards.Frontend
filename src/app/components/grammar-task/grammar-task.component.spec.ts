import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrammarTaskComponent } from './grammar-task.component';

describe('GrammarTaskComponent', () => {
  let component: GrammarTaskComponent;
  let fixture: ComponentFixture<GrammarTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrammarTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrammarTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

