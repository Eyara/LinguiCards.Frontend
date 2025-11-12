import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { combineLatest, map, Observable, shareReplay, Subscription, tap } from 'rxjs';
import { SelectedLanguageService } from '../../components/language/selected-language.service';
import { LanguageModel } from '../../models/language.model';
import { LanguageService } from '../../components/language/language.service';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoginService } from '../../components/login/login.service';
import { SideNavService } from '../side-nav/side-nav.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatFormFieldModule, MatSelectModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
  selectedLanguage: LanguageModel = {
    id: 1, name: 'English',
    editMode: false,
    url: '',
    languageDictionaryId: 0,
    userId: 0
  };
  selectedLanguage$: Observable<LanguageModel> | undefined;
  isAuthenticated$: Observable<boolean> | undefined;
  languages$: Observable<LanguageModel[]> | undefined;
  showLanguageSelector$: Observable<boolean> | undefined;
  private languageSubscription: Subscription = new Subscription();

  constructor(
    private languageService: LanguageService,
    private selectedLanguageService: SelectedLanguageService,
    private loginService: LoginService,
    private sidenavService: SideNavService,
    private router: Router
  ) {
    this.selectedLanguage$ = this.selectedLanguageService.selectedLanguage$
      .pipe(
        shareReplay(1),
        tap(language => this.selectedLanguage = language)
      );
  }

  ngOnInit() {
    this.languages$ = this.languageService.getAllLanguages().pipe(
      shareReplay(1),
      map(languages => languages.map(language => ({ ...language, editMode: false })))
    );

    this.isAuthenticated$ = this.loginService.isAuthenticated();
    
    this.showLanguageSelector$ = combineLatest([
      this.isAuthenticated$,
      this.router.events.pipe(
        map(() => !this.router.url.includes('/language-page'))
      )
    ]).pipe(
      map(([isAuthenticated, isNotLanguagePage]) => isAuthenticated && isNotLanguagePage),
      shareReplay(1)
    );
  }

  changeLanguage(event: unknown) {
    const newLanguageId = (event as { value: number }).value;
    if (this.languages$) {
      this.languageSubscription.add(this.languages$.subscribe(languages => {
        const newLanguage = languages.find(lang => lang.id === newLanguageId);
        if (newLanguage) {
          this.selectedLanguageService.setLanguage(newLanguage);
        }
      }));
    }
  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }

  ngOnDestroy() {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }
}
