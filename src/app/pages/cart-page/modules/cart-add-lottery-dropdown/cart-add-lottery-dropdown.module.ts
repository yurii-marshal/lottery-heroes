import { NgModule } from '@angular/core';
import { CartAddLotteryDropdownContainerComponent } from './cart-add-lottery-dropdown.container.component';
import { CartAddLotteryDropdownComponent } from './components/cart-add-lottery-dropdown/cart-add-lottery-dropdown.component';
import { SharedModule } from '../../../../modules/shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    SharedModule,
    FormsModule
  ],
  declarations: [
    CartAddLotteryDropdownComponent,
    CartAddLotteryDropdownContainerComponent
  ],
  exports: [
    CartAddLotteryDropdownContainerComponent
  ]
})
export class CartAddLotteryDropdownModule {}
