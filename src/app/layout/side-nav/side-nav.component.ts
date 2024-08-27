import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenav } from '@angular/material/sidenav';
import { SideNavService } from './side-nav.service';
import { Subscription } from 'rxjs';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'side-nav',
  standalone: true,
  imports: [MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, RouterOutlet],
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
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