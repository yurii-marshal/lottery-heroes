import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LotteryWidgetHotJackpotsComponent } from './components/lottery-widget-hot-jackpots.component';
import { RouterModule } from '@angular/router';
import { LotteryWidgetHotJackpotsContainerComponent } from './lottery-widget-hot-jackpots.container.component';
import { SharedModule } from '../shared/shared.module';
import { CountdownModule } from '../countdown/countdown.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    CountdownModule
  ],
  declarations: [
    LotteryWidgetHotJackpotsComponent,
    LotteryWidgetHotJackpotsContainerComponent
  ],
  exports: [
    LotteryWidgetHotJackpotsContainerComponent
  ]
})
export class LotteryWidgetHotJackpotsModule { }
