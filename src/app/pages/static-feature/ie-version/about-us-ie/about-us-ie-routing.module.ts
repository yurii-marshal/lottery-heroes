import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AboutUsIeComponent } from './about-us-ie.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: AboutUsIeComponent}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AboutUsIeRoutingModule { }
