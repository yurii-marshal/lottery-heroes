import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AboutUsInnerUKComponent } from './about-us-inner-uk.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: AboutUsInnerUKComponent}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AboutUsInnerUkRoutingModule { }
