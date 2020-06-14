import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FaqUkComponent } from './faq-uk.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: FaqUkComponent}
    ])
  ],
  exports: [
    RouterModule
  ],
})
export class FaqUkRoutingModule { }
