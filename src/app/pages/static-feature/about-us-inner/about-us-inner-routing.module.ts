import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AboutUsInnerComponent } from './about-us-inner.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: AboutUsInnerComponent}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AboutUsInnerRoutingModule { }
