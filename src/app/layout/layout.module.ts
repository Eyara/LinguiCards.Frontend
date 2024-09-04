import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SideNavComponent} from './side-nav/side-nav.component';
import {HeaderComponent} from './header/header.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    SideNavComponent,
    HeaderComponent
  ],
  exports: [
    SideNavComponent,
    HeaderComponent
  ]
})
export class LayoutModule {
}
