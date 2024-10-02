import { Component } from '@angular/core';
import { GrammarService } from './grammar.service';
import { CribResponseModel } from '../../models/crib.model';
import { Observable, of, shareReplay } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grammar-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grammar-page.component.html',
  styleUrl: './grammar-page.component.scss'
})
export class GrammarPageComponent {
  languageId: number = 0;
  cribs$: Observable<CribResponseModel[]> = of([]);

  constructor(private route: ActivatedRoute, private grammarService: GrammarService) {
    this.route.params.subscribe((params) => {
      this.languageId = params['languageId'];
    });

    this.cribs$ = this.grammarService.getAllCribs(this.languageId).pipe(shareReplay(1));
  }
}
