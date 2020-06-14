import {NgModule} from '@angular/core';

import {PersonalResultsContainerComponent} from './personal-results.container.component';
import {PersonalResultsComponent} from './components/personal-results/personal-results.component';
import {SharedModule} from '../../modules/shared/shared.module';
import {PersonalResultsRoutingModule} from './personal-results-routing.module';
import {LotteryWidgetsModule} from '../../modules/lottery-widgets/lottery-widgets.module';
import {BuySameLineBoxModule} from './modules/buy-same-line-box/buy-same-line-box.module';
import {SubscribeLinesBoxModule} from './modules/subscribe-lines-box/subscribe-lines-box.module';
import {BetterOddsOfferBoxModule} from './modules/better-odds-offer-box/better-odds-offer-box.module';
import {WinningResultsModule} from './modules/winning-results/winning-results.module';
import {BiggestJackpotLotteryBoxModule} from './modules/biggest-jackpot-lottery-box/biggest-jackpot-lottery-box.module';
import {OfferBestOddsComboBoxModule} from './modules/offer-best-odds-combo-box/offer-best-odds-combo-box.module';
import {Offer51LotteryBoxModule} from './modules/offer-5-1-lottery-box/offer-5-1-lottery-box.module';
import {RealTimeNotificationsModule} from '../thank-you-page/modules/real-time-notifications/real-time-notifications.module';

@NgModule({
  imports: [
    SharedModule,
    PersonalResultsRoutingModule,
    WinningResultsModule,
    LotteryWidgetsModule,
    BuySameLineBoxModule,
    SubscribeLinesBoxModule,
    BetterOddsOfferBoxModule,
    BiggestJackpotLotteryBoxModule,
    OfferBestOddsComboBoxModule,
    Offer51LotteryBoxModule,
    RealTimeNotificationsModule
  ],
  declarations: [
    PersonalResultsContainerComponent,
    PersonalResultsComponent,
  ]
})
export class PersonalResultsModule {
}
