import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'ng-select';

import { CartItemLotteryContainerComponent } from './cart-item-lottery.container.component';
import { CartItemLotteryComponent } from './components/cart-item-lottery/cart-item-lottery.component';
import { SharedModule } from '../../../../modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SelectModule,
    SharedModule
  ],
  declarations: [
    CartItemLotteryContainerComponent,
    CartItemLotteryComponent,
  ],
  exports: [
    CartItemLotteryContainerComponent,
  ],
})
export class CartItemLotteryModule {
}
