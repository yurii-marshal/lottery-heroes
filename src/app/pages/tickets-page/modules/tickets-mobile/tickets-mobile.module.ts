import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../../modules/shared/shared.module';
import { CountdownModule } from '../../../../modules/countdown/countdown.module';
import { LotteryInfoModule } from '../../../../modules/lottery-info/lottery-info.module';

import { TicketsMobileContainerComponent } from './tickets-mobile.container.component';
import { TicketsHeaderMobileComponent } from './components/tickets-header-mobile/tickets-header-mobile.component';

import { TicketMobileComponent } from './components/ticket-mobile/ticket-mobile.component';
import { TicketAsideMobileComponent } from './components/ticket-aside-mobile/ticket-aside-mobile.component';
import { TicketsTitleMobileComponent } from './components/tickets-title-mobile/tickets-title-mobile.component';
import { FilledTicketMobileComponent } from './components/filled-ticket-mobile/filled-ticket-mobile.component';
import { NewTicketMobileComponent } from './components/new-ticket-mobile/new-ticket-mobile.component';
import { TicketEditMobileComponent } from './components/ticket-edit-mobile/ticket-edit-mobile.component';
import { TotalMobileComponent } from './components/total-mobile/total-mobile.component';
import { FreeTicketsBannerMobileComponent } from './components/free-tickets-banner-mobile/free-tickets-banner-mobile.component';
import { FreeFilledTicketMobileComponent } from './components/free-filled-ticket-mobile/free-filled-ticket-mobile.component';

import { TicketsMobileSandbox } from './tickets-mobile.sandbox';
import { TicketSubscriptionsMobileComponent } from './components/ticket-subscriptions-mobile/ticket-subscriptions-mobile.component';
import { LotteryWidgetsModule } from '../../../../modules/lottery-widgets/lottery-widgets.module';
import { SuperNumbersMobileComponent } from './components/super-numbers-mobile/super-numbers-mobile.component';
import { SuperNumbersPickMobileComponent } from './components/super-numbers-pick-mobile/super-numbers-pick-mobile.component';
import { LotteryInfoCmsBasedModule } from '../../../../modules/lottery-info-cms-based/lottery-info-cms-based.module';
import { OtherLotteriesModule } from '../../../../modules/other-lotteries/other-lotteries.module';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    CountdownModule,
    LotteryInfoModule,
    LotteryWidgetsModule,
    LotteryInfoCmsBasedModule,
    OtherLotteriesModule,
  ],
  declarations: [
    TicketsMobileContainerComponent,
    TicketsHeaderMobileComponent,
    TicketMobileComponent,
    TicketAsideMobileComponent,
    TicketSubscriptionsMobileComponent,
    TicketsTitleMobileComponent,
    FilledTicketMobileComponent,
    NewTicketMobileComponent,
    TicketEditMobileComponent,
    TotalMobileComponent,
    FreeTicketsBannerMobileComponent,
    FreeFilledTicketMobileComponent,
    SuperNumbersMobileComponent,
    SuperNumbersPickMobileComponent,
  ],
  providers: [
    TicketsMobileSandbox,
  ],
  exports: [
    TicketsMobileContainerComponent,
  ],
})
export class TicketsMobileModule {
}
