import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AboutUsUkComponent } from './about-us-uk.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: AboutUsUkComponent}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AboutUsUkRoutingModule {
}
