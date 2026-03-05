import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GrammarService } from './grammar.service';
import { CribResponseModel, IrregularVerbModel } from '../../models/crib.model';
import { Observable, of, shareReplay } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-grammar-page',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './grammar-page.component.html',
  styleUrl: './grammar-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrammarPageComponent {
  languageId: number = 0;
  cribs$: Observable<CribResponseModel[]> = of([]);
  irregularVerbs$: Observable<IrregularVerbModel[]> = of([]);

  constructor(private route: ActivatedRoute, private grammarService: GrammarService) {
    this.route.params.pipe(
      takeUntilDestroyed()
    ).subscribe((params) => {
      this.languageId = params['languageId'];
      this.loadData();
    });
  }

  private loadData(): void {
    this.cribs$ = this.grammarService.getAllCribs(this.languageId).pipe(shareReplay(1));
    this.irregularVerbs$ = this.grammarService.getIrregularVerbs(this.languageId).pipe(shareReplay(1));
  }
}
