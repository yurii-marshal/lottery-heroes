import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HowToPlayBoxComponent } from './components/how-to-play-box/how-to-play-box.component';
import { HowToPlayBoxContainerComponent } from './how-to-play-box.container.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    HowToPlayBoxContainerComponent,
    HowToPlayBoxComponent
  ],
  exports: [
    HowToPlayBoxContainerComponent
  ]
})
export class HowToPlayBoxModule { }
