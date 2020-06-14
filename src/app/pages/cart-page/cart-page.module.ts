import { NgModule } from '@angular/core';

import { SharedModule } from '../../modules/shared/shared.module';
import { CartPageRoutingModule } from './cart-page.routing.module';
import { CartModule } from './modules/cart/cart.module';
import { AddToCartOffersModule } from './modules/add-to-cart-offers/add-to-cart-offers.module';

import { CartPageContainerComponent } from './cart-page.container.component';
import { CartPageComponent } from './components/cart-page/cart-page.component';

import { CartPageSandbox } from './cart-page.sandbox';
import { CurrencyPipe } from '@angular/common';
import { StepsModule } from '../../modules/steps/steps.module';

@NgModule({
  imports: [
    SharedModule,
    StepsModule,
    CartPageRoutingModule,
    CartModule,
    AddToCartOffersModule
  ],
  declarations: [
    CartPageContainerComponent,
    CartPageComponent,
  ],
  providers: [
    CartPageSandbox,
    CurrencyPipe
  ],
})
export class CartPageModule {
}
