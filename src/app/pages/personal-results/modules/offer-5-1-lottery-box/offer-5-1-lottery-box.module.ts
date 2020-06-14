import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Offer51LotteryBoxComponent } from './components/offer-5-1-lottery-box/offer-5-1-lottery-box.component';
import { Offer51LotteryBoxContainerComponent } from './offer-5-1-lottery-box.container.component';
import { SharedModule } from '../../../../modules/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    Offer51LotteryBoxContainerComponent,
    Offer51LotteryBoxComponent
  ],
  exports: [
    Offer51LotteryBoxContainerComponent
  ],
  entryComponents: [
    Offer51LotteryBoxContainerComponent
  ]
})
export class Offer51LotteryBoxModule { }
