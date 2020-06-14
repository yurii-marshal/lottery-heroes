import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LotteriesResolver } from '../../modules/ex-core/resolvers/lotteries/lotteries.resolver';
import { SyndicatesResolver } from '@libs/biglotteryowin-core/resolvers/syndicates.resolver';
import { HomeComponent } from './components/home/home.component';
import { UpcomingDrawsResolver } from '../../modules/ex-core/resolvers/lotteries/upcoming-draws.resolver';
import { LatestDrawsResolver } from '../../modules/ex-core/resolvers/lotteries/latest-draws.resolver';
import { LuvCurrenciesResolver } from '../../modules/ex-core/resolvers/luv/luv-currencies.resolver';
import { OfferingsPricesResolver } from '../../modules/ex-core/resolvers/offerings/offerings-prices.resolver';
import { OfferingsOffersResolver } from '../../modules/ex-core/resolvers/offerings/offerings-offers.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
        resolve: {
          lotteries: LotteriesResolver,
          syndicates: SyndicatesResolver,
          upcomingDraws: UpcomingDrawsResolver,
          latestDraws: LatestDrawsResolver,
          currencies: LuvCurrenciesResolver,
          offeringsPrices: OfferingsPricesResolver,
          offeringsOffers: OfferingsOffersResolver,
        },
      }
    ])
  ],
  exports: [RouterModule],
  providers: []
})
export class HomeRoutingModule { }
