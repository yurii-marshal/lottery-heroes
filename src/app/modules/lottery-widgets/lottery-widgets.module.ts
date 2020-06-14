import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CountdownModule } from '../countdown/countdown.module';
import { SharedModule } from '../shared/shared.module';

import {
  LotteryWidgetsDrawResultsContainerComponent
} from './modules/lottery-widgets-draw-results/lottery-widgets-draw-results.container.component';
import { LotteryWidgetsHotNumbersContainerComponent } from './containers/lottery-widgets-hot-numbers.container.component';
import { LotteryWidgetsJackpotChangesContainerComponent } from './containers/lottery-widgets-jackpot-changes.container.component';
import { LotteryWidgetsNextDrawContainerComponent } from './containers/lottery-widgets-next-draw.container.component';
import { LotteryWidgetsOddsContainerComponent } from './containers/lottery-widgets-odds.container.component';
import { LotteryWidgetsStatisticsContainerComponent } from './containers/lottery-widgets-statistics.container.component';
import { LotteryWidgetsStoriesContainerComponent } from './containers/lottery-widgets-stories.container.component';
import { LotteryWidgetsAboutContainerComponent } from './containers/lottery-widgets-about.container.component';
import { LotteryWidgetsHotNumbersComponent } from './components/lottery-widgets-hot-numbers/lottery-widgets-hot-numbers.component';
import {
  LotteryWidgetsJackpotChangesComponent
} from './components/lottery-widgets-jackpot-changes/lottery-widgets-jackpot-changes.component';
import { LotteryWidgetsNextDrawComponent } from './components/lottery-widgets-next-draw/lottery-widgets-next-draw.component';
import { LotteryWidgetsOddsComponent } from './components/lottery-widgets-odds/lottery-widgets-odds.component';
import { LotteryWidgetsStatisticsComponent } from './components/lottery-widgets-statistics/lottery-widgets-statistics.component';
import { LotteryWidgetsStoriesComponent } from './components/lottery-widgets-stories/lottery-widgets-stories.component';
import { LotteryWidgetsAboutComponent } from './components/lottery-widgets-about/lottery-widgets-about.component';
import {
  LotteryWidgetsSeoDescriptionComponent
} from './components/lottery-widgets-seo-description/lottery-widgets-seo-description.component';
import { LotteryWidgetsSeoDescriptionContainerComponent } from './containers/lottery-widgets-seo-description.container.component';
import { LotteryWidgetsNotificationComponent } from './components/lottery-widgets-notification/lottery-widgets-notification.component';
import { LotteryWidgetsNotificationContainerComponent } from './containers/lottery-widgets-notification.container.component';
import { CurrencyPipe } from '@angular/common';
import { JackpotFormatPipe } from '../shared/pipes/jackpot-format.pipe';
import { LotteryWidgetsBeforeCutoffContainerComponent } from './containers/lottery-widgets-before-cutoff.container.component';
import { LotteryWidgetsBeforeCutoffComponent } from './components/lottery-widgets-before-cutoff/lottery-widgets-before-cutoff.component';
import {
  LotteryWidgetsConversionLightboxComponent
} from './components/lottery-widgets-conversion-lightbox/lottery-widgets-conversion-lightbox.component';
import { LotteryWidgetsConversionLightboxContainerComponent } from './containers/lottery-widgets-conversion-lightbox.container.component';
import { LotteryWidgetsDrawResultsModule } from './modules/lottery-widgets-draw-results/lottery-widgets-draw-results.module';


@NgModule({
  imports: [
    SharedModule,
    CountdownModule,
    RouterModule,
    LotteryWidgetsDrawResultsModule
  ],
  declarations: [
    LotteryWidgetsHotNumbersContainerComponent,
    LotteryWidgetsJackpotChangesContainerComponent,
    LotteryWidgetsNextDrawContainerComponent,
    LotteryWidgetsOddsContainerComponent,
    LotteryWidgetsStatisticsContainerComponent,
    LotteryWidgetsStoriesContainerComponent,
    LotteryWidgetsAboutContainerComponent,

    LotteryWidgetsHotNumbersComponent,
    LotteryWidgetsJackpotChangesComponent,
    LotteryWidgetsNextDrawComponent,
    LotteryWidgetsOddsComponent,
    LotteryWidgetsStatisticsComponent,
    LotteryWidgetsStoriesComponent,
    LotteryWidgetsAboutComponent,
    LotteryWidgetsSeoDescriptionComponent,
    LotteryWidgetsSeoDescriptionContainerComponent,
    LotteryWidgetsNotificationContainerComponent,
    LotteryWidgetsNotificationComponent,

    LotteryWidgetsBeforeCutoffContainerComponent,
    LotteryWidgetsBeforeCutoffComponent,
    LotteryWidgetsConversionLightboxContainerComponent,
    LotteryWidgetsConversionLightboxComponent
  ],
  exports: [
    LotteryWidgetsDrawResultsContainerComponent,
    LotteryWidgetsHotNumbersContainerComponent,
    LotteryWidgetsJackpotChangesContainerComponent,
    LotteryWidgetsNextDrawContainerComponent,
    LotteryWidgetsOddsContainerComponent,
    LotteryWidgetsStatisticsContainerComponent,
    LotteryWidgetsStoriesContainerComponent,
    LotteryWidgetsAboutContainerComponent,
    LotteryWidgetsSeoDescriptionContainerComponent,
    LotteryWidgetsNotificationContainerComponent,
    LotteryWidgetsBeforeCutoffContainerComponent,
    LotteryWidgetsBeforeCutoffComponent,
    LotteryWidgetsConversionLightboxContainerComponent,
    LotteryWidgetsConversionLightboxComponent
  ],
  providers: [
    CurrencyPipe,
    JackpotFormatPipe
  ],
})
export class LotteryWidgetsModule {
}
