import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CashierPageContainerComponent} from './cashier-page.container.component';
import {PaymentPendingComponent} from '../../modules/payment/components/payment-pending/payment-pending.component';
import {PaymentCancelComponent} from '../../modules/payment/components/payment-cancel/payment-cancel.component';
import {PaymentFailureComponent} from '../../modules/payment/components/payment-failure/payment-failure.component';
import {ComingSoonComponent} from '../../modules/coming-soon/coming-soon.component';

import {AuthGuard} from '../../modules/ex-core/guards/auth.guard';
import {CashierGuard} from '../../modules/ex-core/guards/cashier.guard';
import {ToFailureComponent} from './components/transitions/to-failure/to-failure.component';
import {ToSuccessComponent} from './components/transitions/to-success/to-success.component';
import {ToCancelComponent} from './components/transitions/to-cancel/to-cancel.component';
import {ToFailureLimitedComponent} from './components/transitions/to-failure-limited/to-failure-limited.component';
import {ToPendingComponent} from './components/transitions/to-pending/to-pending.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [
      AuthGuard,
      CashierGuard,
    ],
    component: CashierPageContainerComponent,
  },
  {
    path: 'payment-pending',
    canActivate: [
      AuthGuard,
    ],
    component: PaymentPendingComponent,
  },
  {
    path: 'payment-cancel',
    canActivate: [
      AuthGuard,
    ],
    component: PaymentCancelComponent,
  },
  {
    path: 'payment-failure',
    canActivate: [
      AuthGuard,
    ],
    component: PaymentFailureComponent,
  },
  {
    path: 'payment-failure-limited',
    canActivate: [
      AuthGuard,
    ],
    component: ComingSoonComponent,
  },
  {
    path: 'frame-to-failure',
    component: ToFailureComponent,
  },
  {
    path: 'frame-to-success',
    component: ToSuccessComponent,
  },
  {
    path: 'frame-to-cancel',
    component: ToCancelComponent,
  },
  {
    path: 'frame-to-failure-limited',
    component: ToFailureLimitedComponent,
  },
  {
    path: 'frame-to-pending',
    component: ToPendingComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class CashierPageRoutingModule {
}
