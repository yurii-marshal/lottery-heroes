import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItemSyndicateComponent } from './components/cart-item-syndicate/cart-item-syndicate.component';
import { CartItemSyndicateContainerComponent } from './cart-item-syndicate.container.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    CartItemSyndicateContainerComponent,
    CartItemSyndicateComponent
  ],
  exports: [
    CartItemSyndicateContainerComponent
  ]
})
export class CartItemSyndicateModule { }
