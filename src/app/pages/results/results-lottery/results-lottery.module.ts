import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultsLotteryRoutingModule } from './results-lottery-routing.module';
import { LotteryWidgetsModule } from '../../../modules/lottery-widgets/lottery-widgets.module';
import { SocialModule } from '../../../modules/social/social.module';

import { ResultsLotteryComponent } from './components/results-lottery/results-lottery.component';
import { ResultsLotteryTitleComponent } from './components/results-lottery-title/results-lottery-title.component';
import { ResultsLotteryInfoComponent } from './components/results-lottery-info/results-lottery-info.component';

import { ResultsLotteryTitleContainerComponent } from './containers/results-lottery-title.container.component';
import { ResultsLotteryInfoContainerComponent } from './containers/results-lottery-info.container.component';
import { SharedModule } from '../../../modules/shared/shared.module';
import { LotteryWidgetSimilarModule } from '../../../modules/lottery-widget-similar/lottery-widget-similar.module';
import { LotteryWidgetHotJackpotsModule } from '../../../modules/lottery-widget-hot-jackpots/lottery-widget-hot-jackpots.module';
import { ResultsAsideModule } from '../results-aside/results-aside.module';

@NgModule({
  imports: [
    CommonModule,
    ResultsLotteryRoutingModule,
    SocialModule,
    SharedModule,
    LotteryWidgetsModule,
    LotteryWidgetSimilarModule,
    LotteryWidgetHotJackpotsModule,
    ResultsAsideModule
  ],
  declarations: [
    ResultsLotteryComponent,
    ResultsLotteryTitleComponent,
    ResultsLotteryInfoComponent,
    ResultsLotteryTitleContainerComponent,
    ResultsLotteryInfoContainerComponent,
  ],
})
export class ResultsLotteryModule {
}
