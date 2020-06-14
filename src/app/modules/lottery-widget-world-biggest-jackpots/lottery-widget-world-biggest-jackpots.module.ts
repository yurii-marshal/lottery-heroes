import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LotteryWidgetWorldBiggestJackpotsComponent } from './components/lottery-widget-world-biggest-jackpots.component';
import { LotteryWidgetWorldBiggestJackpotsContainerComponent } from './lottery-widget-world-biggest-jackpots.container.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    LotteryWidgetWorldBiggestJackpotsContainerComponent,
    LotteryWidgetWorldBiggestJackpotsComponent
  ],
  exports: [
    LotteryWidgetWorldBiggestJackpotsContainerComponent
  ]
})
export class LotteryWidgetWorldBiggestJackpotsModule { }
