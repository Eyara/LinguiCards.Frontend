import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SideNavService } from './side-nav.service';
import { map, Observable, switchMap } from 'rxjs';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { LoginService } from '../../components/login/login.service';
import { CommonModule } from '@angular/common';
import { SelectedLanguageService } from '../../components/language/selected-language.service';

@Component({
  selector: 'side-nav',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, RouterOutlet, RouterModule],
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNavComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  toggle$: Observable<boolean>;

  constructor(private sidenavService: SideNavService, private router: Router, public loginService: LoginService, private selectedLanguageService: SelectedLanguageService) {
    // TODO maybe filter false entry when user logins
    this.toggle$ = this.sidenavService.toggle$.pipe(
      switchMap(() => this.loginService.isAuthenticated()),
      map(isAuthenticated => {
        if (isAuthenticated) {
          this.sidenav.toggle();
        }
        return isAuthenticated;
      })
    );

    this.selectedLanguageService.getSelectedLanguageSubject$().subscribe(language => {
      this.router.navigate(['/word-page', language.id]);
    });
  }

  logout() {
    this.closeAfterClick();
    this.loginService.logout();
    this.router.navigate(['/sign-in']);
  }

  closeAfterClick() {
    this.sidenav.close();
  }
}
