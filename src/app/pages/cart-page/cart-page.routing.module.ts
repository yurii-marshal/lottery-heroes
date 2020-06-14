import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LotteriesResolver } from '../../modules/ex-core/resolvers/lotteries/lotteries.resolver';
import { SyndicatesResolver } from '@libs/biglotteryowin-core/resolvers/syndicates.resolver';
import { UpcomingDrawsResolver } from '../../modules/ex-core/resolvers/lotteries/upcoming-draws.resolver';
import { LuvCurrenciesResolver } from '../../modules/ex-core/resolvers/luv/luv-currencies.resolver';
import { OfferingsPricesResolver } from '../../modules/ex-core/resolvers/offerings/offerings-prices.resolver';
import { OfferingsOffersResolver } from '../../modules/ex-core/resolvers/offerings/offerings-offers.resolver';
import { OfferingsCombosResolver } from '../../modules/ex-core/resolvers/offerings/offerings-combos.resolver';

import { CartPageContainerComponent } from './cart-page.container.component';
import {OfferingsBundlesResolver} from '../../modules/ex-core/resolvers/offerings/offerings-bundles.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: {
      lotteries: LotteriesResolver,
      syndicates: SyndicatesResolver,
      upcomingDraws: UpcomingDrawsResolver,
      currencies: LuvCurrenciesResolver,
      offeringsPrices: OfferingsPricesResolver,
      offeringsOffers: OfferingsOffersResolver,
      offeringsCombos: OfferingsCombosResolver,
      offeringsBundles: OfferingsBundlesResolver,
    },
    component: CartPageContainerComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class CartPageRoutingModule {
}
