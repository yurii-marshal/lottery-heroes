import { NgModule } from '@angular/core';

import { SharedModule } from '../../modules/shared/shared.module';
import { TicketsDesktopModule } from './modules/tickets-desktop/tickets-desktop.module';
import { TicketsMobileModule } from './modules/tickets-mobile/tickets-mobile.module';

import { TicketsPageContainerComponent } from './tickets-page.container.component';
import { TicketsPageDesktopComponent } from './components/tickets-page-desktop/tickets-page-desktop.component';
import { TicketsPageMobileComponent } from './components/tickets-page-mobile/tickets-page-mobile.component';

import { TicketsPageSandbox } from './tickets-page.sandbox';
import { StepsModule } from '../../modules/steps/steps.module';

@NgModule({
  imports: [
    SharedModule,
    StepsModule,
    TicketsDesktopModule,
    TicketsMobileModule,
  ],
  declarations: [
    TicketsPageContainerComponent,
    TicketsPageDesktopComponent,
    TicketsPageMobileComponent,
  ],
  providers: [
    TicketsPageSandbox
  ],
  exports: [
    TicketsPageContainerComponent
  ]
})
export class TicketsPageModule {
}
