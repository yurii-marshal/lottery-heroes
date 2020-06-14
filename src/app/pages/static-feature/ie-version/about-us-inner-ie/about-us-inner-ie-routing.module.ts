import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AboutUsInnerIeComponent } from './about-us-inner-ie.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: AboutUsInnerIeComponent}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AboutUsInnerIeRoutingModule { }
