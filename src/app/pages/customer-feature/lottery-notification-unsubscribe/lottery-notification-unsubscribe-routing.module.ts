import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LotteryNotificationUnsubscribeComponent } from './lottery-notification-unsubscribe.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: LotteryNotificationUnsubscribeComponent}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class LotteryNotificationUnsubscribeRoutingModule { }
