import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AboutMenuComponent } from './components/about-menu/about-menu.component';
import { RouterModule } from '@angular/router';
import { AboutWrapperComponent } from './components/about-wrapper/about-wrapper.component';



@NgModule({
  imports: [
    SharedModule,
    RouterModule,
  ],
  declarations: [
    AboutMenuComponent,
    AboutWrapperComponent,
  ],
  exports: [
    AboutWrapperComponent,
  ]
})
export class AboutWrapperModule { }
