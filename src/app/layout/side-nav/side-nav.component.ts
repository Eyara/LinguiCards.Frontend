import { Component, ViewChild, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenav } from '@angular/material/sidenav';
import { SideNavService } from './side-nav.service';
import { Subscription } from 'rxjs';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'side-nav',
  standalone: true,
  imports: [MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, RouterOutlet, RouterModule],
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNavComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  private subscription: Subscription | undefined;

  constructor(private sidenavService: SideNavService) {}

  ngOnInit() {
    this.subscription = this.sidenavService.toggle$.subscribe(() => {
      this.toggleSidenav();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }
}