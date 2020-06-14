import { NgModule, Optional, SkipSelf } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { BIGLOTTERYOWIN_BASE_API_URL } from '@libs/biglotteryowin-api/tokens/biglotteryowin-base-api-url.token';
import { BiglotteryowinApiModule } from '@libs/biglotteryowin-api/biglotteryowin-api.module';

import { biglotteryowinCoreReducers } from './store/reducers';
import { LotteriesEffects } from './store/effects/lotteries.effects';
import { BrandsEffects } from './store/effects/brands.effects';
import { DrawsEffects } from './store/effects/draws.effects';
import { SyndicatesEffects } from './store/effects/syndicates.effects';
import { PricesEffects } from './store/effects/prices.effects';
import { OffersEffects } from './store/effects/offers.effects';
import { BrandQueryService } from './services/queries/brand-query.service';
import { CurrencyQueryService } from './services/queries/currency-query.service';
import { LotteriesQueryService } from './services/queries/lotteries-query.service';
import { SyndicatesQueryService } from './services/queries/syndicates-query.service';
import { SyndicatesCommandService } from './services/commands/syndicates-command.service';
import { QaQueryService } from './services/queries/qa-query.service';
import { DrawsQueryService } from './services/queries/draws-query.service';
import { DrawsCommandService } from './services/commands/draws-command.service';

import { LotteriesResolver } from './resolvers/lotteries.resolver';
import { SyndicatesResolver } from './resolvers/syndicates.resolver';

export function BaseApiUrlFactory(brandQueryService: BrandQueryService): string {
  return brandQueryService.getBrandApiUrl();
}

@NgModule({
  imports: [
    BiglotteryowinApiModule,
    StoreModule.forFeature('BiglotteryowinCore', biglotteryowinCoreReducers),
    EffectsModule.forFeature([
      BrandsEffects,
      LotteriesEffects,
      DrawsEffects,
      SyndicatesEffects,
      PricesEffects,
      OffersEffects,
    ]),
  ],
  providers: [
    {
      provide: BIGLOTTERYOWIN_BASE_API_URL,
      useFactory: BaseApiUrlFactory,
      deps: [BrandQueryService]
    },
    BrandQueryService,
    CurrencyQueryService,
    LotteriesQueryService,
    DrawsQueryService,
    DrawsCommandService,
    SyndicatesQueryService,
    QaQueryService,
    SyndicatesCommandService,
    QaQueryService,

    // RESOLVERS
    LotteriesResolver,
    SyndicatesResolver,
  ],
})
export class BiglotteryowinCoreModule {
  constructor(@Optional() @SkipSelf() parentModule: BiglotteryowinCoreModule) {
    if (parentModule) {
      throw new Error('BiglotteryowinCoreModule is already loaded.');
    }
  }
}
