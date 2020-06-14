import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LotteryNotificationConfirmationComponent } from './lottery-notification-confirmation.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: LotteryNotificationConfirmationComponent}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class LotteryNotificationConfirmationRoutingModule { }
