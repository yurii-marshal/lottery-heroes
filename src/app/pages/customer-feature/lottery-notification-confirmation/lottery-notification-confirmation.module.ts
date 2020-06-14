import { NgModule } from '@angular/core';

import { LotteryNotificationConfirmationRoutingModule } from './lottery-notification-confirmation-routing.module';
import { LotteryNotificationConfirmationComponent } from './lottery-notification-confirmation.component';
import { SharedModule } from '../../../modules/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    LotteryNotificationConfirmationRoutingModule
  ],
  declarations: [
    LotteryNotificationConfirmationComponent
  ]
})
export class LotteryNotificationConfirmationModule { }
