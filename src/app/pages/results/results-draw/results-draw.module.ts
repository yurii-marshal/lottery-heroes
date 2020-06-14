import { NgModule } from '@angular/core';

import { ResultsDrawRoutingModule } from './results-draw-routing.module';
import { LotteryWidgetsModule } from '../../../modules/lottery-widgets/lottery-widgets.module';
import { CountdownModule } from '../../../modules/countdown/countdown.module';
import { SocialModule } from '../../../modules/social/social.module';
import { SharedModule } from '../../../modules/shared/shared.module';

import { ResultsDrawTitleComponent } from './components/results-draw-title/results-draw-title.component';
import { ResultsDrawResultComponent } from './components/results-draw-result/results-draw-result.component';
import { ResultsDrawPrizesComponent } from './components/results-draw-prizes/results-draw-prizes.component';
import { ResultsDrawFactsComponent } from './components/results-draw-facts/results-draw-facts.component';
import { ResultsDrawNextDrawComponent } from './components/results-draw-next-draw/results-draw-next-draw.component';
import { ResultsDrawComponent } from './components/results-draw/results-draw.component';

import { ResultsDrawTitleContainerComponent } from './containers/results-draw-title.container.component';
import { ResultsDrawResultContainerComponent } from './containers/results-draw-result.container.component';
import { ResultsDrawPrizesContainerComponent } from './containers/results-draw-prizes.container.component';
import { ResultsDrawFactsContainerComponent } from './containers/results-draw-facts.container.component';
import { ResultsDrawNextDrawContainerComponent } from './containers/results-draw-next-draw.container.component';
import { ResultsDrawDescriptionContainerComponent } from './containers/results-draw-description.container.component';
import { ResultsDrawDescriptionComponent } from './components/results-draw-content/results-draw-description.component';
import { LotteryWidgetSimilarModule } from '../../../modules/lottery-widget-similar/lottery-widget-similar.module';
import { LotteryWidgetHotJackpotsModule } from '../../../modules/lottery-widget-hot-jackpots/lottery-widget-hot-jackpots.module';
import { ResultsAsideModule } from '../results-aside/results-aside.module';

@NgModule({
  imports: [
    SharedModule,
    ResultsDrawRoutingModule,
    LotteryWidgetsModule,
    LotteryWidgetSimilarModule,
    LotteryWidgetHotJackpotsModule,
    CountdownModule,
    SocialModule,
    ResultsAsideModule
  ],
  declarations: [
    ResultsDrawComponent,
    ResultsDrawTitleComponent,
    ResultsDrawResultComponent,
    ResultsDrawPrizesComponent,
    ResultsDrawFactsComponent,
    ResultsDrawNextDrawComponent,
    ResultsDrawDescriptionComponent,
    ResultsDrawTitleContainerComponent,
    ResultsDrawResultContainerComponent,
    ResultsDrawPrizesContainerComponent,
    ResultsDrawFactsContainerComponent,
    ResultsDrawNextDrawContainerComponent,
    ResultsDrawDescriptionContainerComponent,
  ],
})
export class ResultsDrawModule {
}
