import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqBoxComponent } from './components/faq-box/faq-box.component';
import { FaqBoxContainerComponent } from './faq-box.container.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FaqBoxContainerComponent,
    FaqBoxComponent
  ],
  exports: [
    FaqBoxContainerComponent
  ]
})
export class FaqBoxModule { }
