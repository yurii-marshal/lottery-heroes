import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'ng-select';

import { CartItemComboContainerComponent } from './cart-item-combo.container.component';
import { CartItemComboComponent } from './components/cart-item-combo/cart-item-combo.component';
import { CartItemComboLotteryComponent } from './components/cart-item-combo-lottery/cart-item-combo-lottery.component';
import { SharedModule } from '../../../../modules/shared/shared.module';
import { CartItemComboSyndicateComponent } from './components/cart-item-combo-syndicate/cart-item-combo-syndicate.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SelectModule,
    SharedModule
  ],
  declarations: [
    CartItemComboContainerComponent,
    CartItemComboComponent,
    CartItemComboLotteryComponent,
    CartItemComboSyndicateComponent,
  ],
  exports: [
    CartItemComboContainerComponent,
  ],
})
export class CartItemComboModule {
}
