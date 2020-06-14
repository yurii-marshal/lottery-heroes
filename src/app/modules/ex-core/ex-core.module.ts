import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';

import { AuthGuard } from './guards/auth.guard';
import { IsNotAuthGuard } from './guards/is-not-auth.quard';
import { CashierGuard } from './guards/cashier.guard';
import { DrawExistsGuard } from './guards/draw-exists.guard';
import { LotterySoldGuard } from './guards/lottery-sold.guard';

import { LotteriesResolver } from './resolvers/lotteries/lotteries.resolver';
import { LotteriesSoldResolver } from './resolvers/lotteries/lotteries-sold.resolver';
import { UpcomingDrawsResolver } from './resolvers/lotteries/upcoming-draws.resolver';
import { LatestDrawsResolver } from './resolvers/lotteries/latest-draws.resolver';
import { LuvCountriesResolver } from './resolvers/luv/luv-countries.resolver';
import { LuvCurrenciesResolver } from './resolvers/luv/luv-currencies.resolver';
import { OfferingsPricesResolver } from './resolvers/offerings/offerings-prices.resolver';
import { OfferingsOffersResolver } from './resolvers/offerings/offerings-offers.resolver';
import { OfferingsCombosResolver } from './resolvers/offerings/offerings-combos.resolver';

import { ConfigService } from './services/config.service';
import { SortedByPriorityComboListResolver } from './resolvers/combos/sorted-by-priority-combo-list.resolver';
import {OfferingsBundlesResolver} from './resolvers/offerings/offerings-bundles.resolver';
import {SortedByPriorityBundleListResolver} from './resolvers/bundles/sorted-by-priority-bundle-list.resolver';

@NgModule()
export class ExCoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ExCoreModule,
      providers: [
        // GUARDS
        AuthGuard,
        IsNotAuthGuard,
        CashierGuard,
        DrawExistsGuard,
        LotterySoldGuard,

        // RESOLVERS
        LotteriesResolver,
        LotteriesSoldResolver,
        UpcomingDrawsResolver,
        LatestDrawsResolver,
        LuvCountriesResolver,
        LuvCurrenciesResolver,
        OfferingsPricesResolver,
        OfferingsOffersResolver,
        OfferingsCombosResolver,
        OfferingsBundlesResolver,
        SortedByPriorityComboListResolver,
        SortedByPriorityBundleListResolver,

        // SERVICES
        ConfigService,
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: ExCoreModule) {
    if (parentModule) {
      throw new Error('ExCoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
