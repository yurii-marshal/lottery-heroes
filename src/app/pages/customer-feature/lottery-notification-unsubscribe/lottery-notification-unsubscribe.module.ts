import { NgModule } from '@angular/core';

import { LotteryNotificationUnsubscribeRoutingModule } from './lottery-notification-unsubscribe-routing.module';
import { SharedModule } from '../../../modules/shared/shared.module';
import { LotteryNotificationUnsubscribeComponent } from './lottery-notification-unsubscribe.component';

@NgModule({
  imports: [
    SharedModule,
    LotteryNotificationUnsubscribeRoutingModule
  ],
  declarations: [LotteryNotificationUnsubscribeComponent]
})
export class LotteryNotificationUnsubscribeModule { }
