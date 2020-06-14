import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../../../../modules/shared/shared.module';
import {CountdownModule} from '../../../../modules/countdown/countdown.module';

import {CartSandbox} from './cart.sandbox';

import {CartContainerComponent} from './cart.container.component';
import {CartComponent} from './components/cart/cart.component';
import {CartEmptyComponent} from './components/cart-empty/cart-empty.component';
import {CartItemsComponent} from './components/cart-items/cart-items.component';
import {NotificationMultiplesLinesComponent} from './components/notification-multiples-lines/notification-multiples-lines.component';
import {CartItemLotteryModule} from '../cart-item-lottery/cart-item-lottery.module';
import {CartItemComboModule} from '../cart-item-combo/cart-item-combo.module';
import {JackpotFormatPipe} from '../../../../modules/shared/pipes/jackpot-format.pipe';
import {NotificationDontMissOutComponent} from './components/notification-dont-miss-out/notification-dont-miss-out.component';
import {CartItemSyndicateModule} from '../cart-item-syndicate/cart-item-syndicate.module';
import {CartAddLotteryDropdownModule} from '../cart-add-lottery-dropdown/cart-add-lottery-dropdown.module';
import {CartItemBundleModule} from '../cart-item-bundle/cart-item-bundle.module';
import {CashierPageSandbox} from '../../../cashier-page/cashier-page.sandbox';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    CountdownModule,
    CartItemLotteryModule,
    CartItemComboModule,
    CartItemBundleModule,
    CartItemSyndicateModule,
    CartAddLotteryDropdownModule
  ],
  declarations: [
    CartContainerComponent,
    CartComponent,
    CartEmptyComponent,
    CartItemsComponent,
    NotificationMultiplesLinesComponent,
    NotificationDontMissOutComponent,
  ],
  providers: [
    CartSandbox,
    CashierPageSandbox,
    JackpotFormatPipe
  ],
  exports: [
    CartContainerComponent,
  ],
})
export class CartModule {
}
