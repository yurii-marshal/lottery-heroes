import { NgModule } from '@angular/core';
import { LotteryWidgetsDrawResultsContainerComponent } from './lottery-widgets-draw-results.container.component';
import { LotteryWidgetsDrawResultsComponent } from './components/lottery-widgets-draw-results/lottery-widgets-draw-results.component';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { LOTTERY_WIDGETS_DRAW_RESULTS_CONFIG, lotteryWidgetsDrawResultsConfig } from './configs/lottery-widgets-draw-results.config';

@NgModule({
  imports: [
    SharedModule,
    RouterModule
  ],
  declarations: [
    LotteryWidgetsDrawResultsComponent,
    LotteryWidgetsDrawResultsContainerComponent
  ],
  exports: [
    LotteryWidgetsDrawResultsContainerComponent
  ],
  providers: [
    { provide: LOTTERY_WIDGETS_DRAW_RESULTS_CONFIG, useValue: lotteryWidgetsDrawResultsConfig }
  ]
})
export class LotteryWidgetsDrawResultsModule {

}
