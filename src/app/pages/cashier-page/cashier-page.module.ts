import {NgModule} from '@angular/core';

import {CashierPageRoutingModule} from './cashier-page.routing.module';
import {SharedModule} from '../../modules/shared/shared.module';
import {LotteryWidgetsModule} from '../../modules/lottery-widgets/lottery-widgets.module';
import {PaymentModule} from '../../modules/payment/payment.module';
import {ComingSoonModule} from '../../modules/coming-soon/coming-soon.module';

import {CashierPageSandbox} from './cashier-page.sandbox';

import {CashierPageContainerComponent} from './cashier-page.container.component';
import {IframeComponent} from './components/iframe/iframe.component';
import {ListCombosModule} from '../combos-page/modules/list-combos/list-combos.module';
import {StepsModule} from '../../modules/steps/steps.module';
import {ListBundlesModule} from '../bundles-page/modules/list-bundles/list-bundles.module';

@NgModule({
  imports: [
    CashierPageRoutingModule,
    SharedModule,
    StepsModule,
    LotteryWidgetsModule,
    PaymentModule,
    ComingSoonModule,
    ListCombosModule,
    ListBundlesModule,
  ],
  providers: [
    CashierPageSandbox,
  ],
  declarations: [
    CashierPageContainerComponent,
    IframeComponent,
  ],
})
export class CashierPageModule {
}
