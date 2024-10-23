import { ChangeDetectionStrategy, Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { SelectedLanguageService } from '../selected-language.service';
import { Router } from '@angular/router';
import { tap, switchMap, map, shareReplay } from 'rxjs/operators';
import { LanguageModel, LanguageStatisticsModel } from '../../../models/language.model';
import { LanguageService } from '../language.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Observable } from 'rxjs';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-language-overview',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './language-overview.component.html',
  styleUrl: './language-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageOverviewComponent implements OnInit, AfterViewInit {
  private currentLanguage: LanguageModel | null = null;
  languageStats$: Observable<LanguageStatisticsModel> = new Observable<LanguageStatisticsModel>();

  // Chart data
  learnedWordsData$: Observable<any[]> = new Observable<any[]>();
  accuracyData$: Observable<any[]> = new Observable<any[]>();
  averageLearnedPercentData$: Observable<any[]> = new Observable<any[]>();

  chartWidth: number = 0;
  chartHeight: number = 0;

  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#3366cc', // blue
      '#dc3912', // red
      '#0099c6', // cyan
    ]
  };

  constructor(
    private selectedLanguageService: SelectedLanguageService,
    private router: Router,
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    this.updateChartDimensions();
    this.languageStats$ = this.selectedLanguageService.getSelectedLanguageSubject$()
      .pipe(
        tap(language => {
          this.router.navigate(['/language-overview', language.id]);
          this.currentLanguage = language;
        }),
        switchMap(language => this.languageService.getLanguageStatistics(language.id)),
        tap(_ => {
          this.updateChartData();
        }),
        shareReplay(1),
      )
  }

  ngAfterViewInit() {
    this.updateChartDimensions();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateChartDimensions();
  }

  private updateChartDimensions() {
    const containerWidth = document.querySelector('.chart-container')?.clientWidth || window.innerWidth;
    
    if (window.innerWidth >= 768) {
      // Desktop
      this.chartWidth = Math.min(containerWidth, 600);
      this.chartHeight = Math.min(this.chartWidth * 0.75, 450);
    } else {
      // Mobile
      this.chartWidth = Math.min(containerWidth - 32, 400); // 32px for padding
      this.chartHeight = Math.min(this.chartWidth * 0.75, 300);
    }
  }

  updateChartData() {
    this.learnedWordsData$ = this.languageStats$.pipe(
      shareReplay(1),
      map(stats => {
        if (stats.activeLearnedPercent && stats.passiveLearnedPercent) {
          return  [
            { name: 'Активный', value: stats.activeLearnedPercent * 100},
            { name: 'Пассивный', value: stats.passiveLearnedPercent * 100 },
            ];
        }
        return [];
      })
    );
    this.accuracyData$ = this.languageStats$.pipe(
      shareReplay(1),
      map(stats => {
        if (stats.activeAverageAccuracy && stats.passiveAverageAccuracy) {
          return [
            { name: 'Активный', value: stats.activeAverageAccuracy * 100 },
            { name: 'Пассивный', value: stats.passiveAverageAccuracy * 100 }
          ];
        }
        return [];
      })
    );
    this.averageLearnedPercentData$ = this.languageStats$.pipe(
      shareReplay(1),
      map(stats => {
        if (stats.activeAverageLearnedPercent && stats.passiveAverageLearnedPercent) {
          return  [
            { name: 'Активный', value: stats.activeAverageLearnedPercent },
            { name: 'Пассивный', value: stats.passiveAverageLearnedPercent }
            ];
        }
        return [];
      })
    );
  }

  navigateToTraining() {
    if (this.currentLanguage) {
      this.router.navigate(['/training-page', this.currentLanguage.id]);
    }
  }
  navigateToWordPage() {
    if (this.currentLanguage) {
      this.router.navigate(['/word-page', this.currentLanguage.id]);
    }
  }
  navigateToGrammar() {
    if (this.currentLanguage) {
      this.router.navigate(['/grammar-page', this.currentLanguage.id]);
    }
  }
}

