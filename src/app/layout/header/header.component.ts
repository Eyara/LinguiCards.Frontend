import {Component} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {SideNavService} from '../side-nav/side-nav.service';
import { LoginService } from '../../components/login/login.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isAuthenticated$: Observable<boolean>;

  constructor(private sidenavService: SideNavService, loginService: LoginService) {
    this.isAuthenticated$ = loginService.isAuthenticated();
  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }

}
