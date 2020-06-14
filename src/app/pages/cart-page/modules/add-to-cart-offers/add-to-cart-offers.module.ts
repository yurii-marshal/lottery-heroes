import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../../modules/shared/shared.module';
import { CountdownModule } from '../../../../modules/countdown/countdown.module';

import { AddToCartOffersContainerComponent } from './add-to-cart-offers.container.component';
import { AddToCartOffersComponent } from './components/add-to-cart-offers/add-to-cart-offers.component';
import { AddToCartOffersItemComponent } from './components/add-to-cart-offers-item/add-to-cart-offers-item.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    CountdownModule,
  ],
  declarations: [
    AddToCartOffersContainerComponent,
    AddToCartOffersComponent,
    AddToCartOffersItemComponent,
  ],
  exports: [
    AddToCartOffersContainerComponent
  ],
})
export class AddToCartOffersModule {
}
