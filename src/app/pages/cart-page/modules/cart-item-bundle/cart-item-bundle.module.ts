import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {SelectModule} from 'ng-select';
import {SharedModule} from '../../../../modules/shared/shared.module';
import {CartItemBundleContainerComponent} from './cart-item-bundle.container.component';
import {CartItemBundleComponent} from './components/cart-item-bundle/cart-item-bundle.component';
import {CartItemBundleLotteryComponent} from './components/cart-item-bundle-lottery/cart-item-bundle-lottery.component';
import {CartItemBundleSyndicateComponent} from './components/cart-item-bundle-syndicate/cart-item-bundle-syndicate.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SelectModule,
    SharedModule
  ],
  declarations: [
    CartItemBundleContainerComponent,
    CartItemBundleComponent,
    CartItemBundleLotteryComponent,
    CartItemBundleSyndicateComponent,
  ],
  exports: [
    CartItemBundleContainerComponent,
  ],
})
export class CartItemBundleModule {
}
