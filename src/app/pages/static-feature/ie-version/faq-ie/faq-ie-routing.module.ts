import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FaqIeComponent } from './faq-ie.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: FaqIeComponent}
    ])
  ],
  exports: [
    RouterModule
  ],
})
export class FaqIeRoutingModule { }

