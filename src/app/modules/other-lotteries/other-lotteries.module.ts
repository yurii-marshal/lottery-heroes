import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { OtherLotteriesContainerComponent } from './other-lotteries-container.component';
import { OtherLotteriesComponent } from './components/other-lotteries/other-lotteries.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  declarations: [
    OtherLotteriesContainerComponent,
    OtherLotteriesComponent,
  ],
  exports: [
    OtherLotteriesContainerComponent,
  ]
})
export class OtherLotteriesModule {
}
