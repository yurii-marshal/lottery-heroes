import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhyBoxContainerComponent } from './why-box.container.component';
import { WhyBoxComponent } from './components/why-box/why-box.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    WhyBoxContainerComponent,
    WhyBoxComponent
  ],
  exports: [
    WhyBoxContainerComponent
  ]
})
export class WhyBoxModule { }
