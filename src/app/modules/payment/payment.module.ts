import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {LotteryWidgetsModule} from '../lottery-widgets/lottery-widgets.module';

import {PaymentPendingComponent} from './components/payment-pending/payment-pending.component';
import {PaymentFailureComponent} from './components/payment-failure/payment-failure.component';
import {PaymentCancelComponent} from './components/payment-cancel/payment-cancel.component';
import {CashierComponent} from './components/cashier/cashier.component';
import {SharedModule} from '../shared/shared.module';
import {LiveChatModule} from '../live-chat/live-chat.module';
import {ToSuccessComponent} from '../../pages/cashier-page/components/transitions/to-success/to-success.component';
import {ToFailureComponent} from '../../pages/cashier-page/components/transitions/to-failure/to-failure.component';
import {ToCancelComponent} from '../../pages/cashier-page/components/transitions/to-cancel/to-cancel.component';
import {ToFailureLimitedComponent} from '../../pages/cashier-page/components/transitions/to-failure-limited/to-failure-limited.component';
import {ToPendingComponent} from '../../pages/cashier-page/components/transitions/to-pending/to-pending.component';


@NgModule({
  imports: [
    RouterModule,
    LotteryWidgetsModule,
    SharedModule,
    LiveChatModule,
  ],
  declarations: [
    PaymentPendingComponent,
    PaymentFailureComponent,
    PaymentCancelComponent,
    CashierComponent,
    ToSuccessComponent,
    ToFailureComponent,
    ToCancelComponent,
    ToPendingComponent,
    ToFailureLimitedComponent,
  ],
  exports: [
    PaymentPendingComponent,
    PaymentFailureComponent,
    PaymentCancelComponent,
    CashierComponent,
    ToSuccessComponent,
    ToFailureComponent,
    ToCancelComponent,
    ToPendingComponent,
    ToFailureLimitedComponent
  ]
})
export class PaymentModule {
}
