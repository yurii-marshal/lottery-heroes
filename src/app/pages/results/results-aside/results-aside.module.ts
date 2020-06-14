import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultsAsideComponent } from './components/results-aside.component';
import { LotteryWidgetHotJackpotsModule } from '../../../modules/lottery-widget-hot-jackpots/lottery-widget-hot-jackpots.module';
import { LotteryWidgetsModule } from '../../../modules/lottery-widgets/lottery-widgets.module';

@NgModule({
  imports: [
    CommonModule,
    LotteryWidgetsModule,
    LotteryWidgetHotJackpotsModule
  ],
  declarations: [
    ResultsAsideComponent
  ],
  exports: [
    ResultsAsideComponent
  ]
})
export class ResultsAsideModule {
}
