import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../../modules/shared/shared.module';
import { CountdownModule } from '../../../../modules/countdown/countdown.module';
import { LotteryInfoModule } from '../../../../modules/lottery-info/lottery-info.module';

import { TicketsDesktopContainerComponent } from './tickets-desktop.container.component';
import { TicketsDesktopComponent } from './components/tickets-desktop/tickets-desktop.component';
import { TicketDesktopComponent } from './components/ticket-desktop/ticket-desktop.component';
import { TicketFreeDesktopComponent } from './components/ticket-free-desktop/ticket-free-desktop.component';
import { LotteryAsideDesktopComponent } from './components/tickets-aside-desktop/tickets-aside-desktop.component';

import { TicketsDesktopSandbox } from './tickets-desktop.sandbox';
import { LotteryWidgetsModule } from '../../../../modules/lottery-widgets/lottery-widgets.module';
import { SuperNumbersComponent } from '../../components/super-numbers/super-numbers.component';
import { FaqCmsModule } from '../../../../modules/faq-cms/faq-cms.module';
import { LotteryInfoCmsBasedModule } from '../../../../modules/lottery-info-cms-based/lottery-info-cms-based.module';
import { OtherLotteriesModule } from '../../../../modules/other-lotteries/other-lotteries.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CountdownModule,
    LotteryInfoModule,
    OtherLotteriesModule,
    LotteryWidgetsModule,
    RouterModule,
    FaqCmsModule,
    LotteryInfoCmsBasedModule
  ],
  declarations: [
    TicketsDesktopContainerComponent,
    TicketsDesktopComponent,
    TicketDesktopComponent,
    TicketFreeDesktopComponent,
    LotteryAsideDesktopComponent,
    SuperNumbersComponent,
  ],
  providers: [
    TicketsDesktopSandbox,
  ],
  exports: [
    TicketsDesktopContainerComponent,
  ],
})
export class TicketsDesktopModule {
}
