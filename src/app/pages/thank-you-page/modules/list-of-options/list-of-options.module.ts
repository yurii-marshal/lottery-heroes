import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListOfOptionsContainerComponent } from './list-of-options.container.component';
import { ListOfOptionsComponent } from './components/list-of-options.component';
import { SubscriptionDiscountModule } from '../subscription-discount/subscription-discount.module';
import { RealTimeNotificationsModule } from '../real-time-notifications/real-time-notifications.module';

@NgModule({
  imports: [
    CommonModule,
    RealTimeNotificationsModule,
    SubscriptionDiscountModule,
  ],
  declarations: [
    ListOfOptionsContainerComponent,
    ListOfOptionsComponent,
  ],
  exports: [
    ListOfOptionsContainerComponent
  ]
})

export class ListOfOptionsModule {
}
