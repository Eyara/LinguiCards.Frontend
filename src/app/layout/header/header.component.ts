import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { combineLatest, map, Observable, shareReplay, Subscription } from 'rxjs';
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
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
  selectedLanguage: LanguageModel = {
    id: 1, name: 'English',
    editMode: false,
    url: '',
    languageDictionaryId: 0
  };
  isAuthenticated$: Observable<boolean> | undefined;
  languages$: Observable<LanguageModel[]> | undefined;
  private languageSubscription: Subscription = new Subscription();

  constructor(
    private languageService: LanguageService,
    private selectedLanguageService: SelectedLanguageService,
    private loginService: LoginService,
    private sidenavService: SideNavService,
    private router: Router
  ) { }
  ngOnInit() {
    this.languages$ = this.languageService.getAllLanguages().pipe(
      shareReplay(1),
      map(languages => languages.map(language => ({ ...language, editMode: false })))
    );

    this.languageSubscription.add(
      combineLatest([
        this.selectedLanguageService.selectedLanguage$,
        this.languages$
      ]).pipe(
        map(([selected, languages]) => {
          if (!selected || !languages.some(lang => lang.id === selected.id)) {
            return languages[0];
          }
          return selected;
        })
      ).subscribe(language => {
        this.selectedLanguage = language;
      })
    );


    this.isAuthenticated$ = this.loginService.isAuthenticated();
  }

  changeLanguage(event: any) {
    const newLanguageId = event.value;
    if (this.languages$) {
      this.languages$.subscribe(languages => {
        const newLanguage = languages.find(lang => lang.id === newLanguageId);
        if (newLanguage) {
          this.selectedLanguageService.setLanguage(newLanguage);
          this.router.navigate(['/word-page', newLanguage.id]);
        }
      });
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
