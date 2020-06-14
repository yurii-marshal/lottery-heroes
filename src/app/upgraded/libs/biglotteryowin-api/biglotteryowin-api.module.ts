import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { BaseApiQueryService } from './services/queries/base-api-query.service';
import { LuvApiQueryService } from './services/queries/luv-api-query.service';
import { LotteriesApiQueryService } from './services/queries/lotteries-api-query.service';
import { OfferingsApiQueryService } from '@libs/biglotteryowin-api/services/queries/offerings-api-query.service';

@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    BaseApiQueryService,
    LuvApiQueryService,
    LotteriesApiQueryService,
    OfferingsApiQueryService,
  ]
})
export class BiglotteryowinApiModule {
  constructor(@Optional() @SkipSelf() parentModule: BiglotteryowinApiModule) {
    if (parentModule) {
      throw new Error('BiglotteryowinApiModule is already loaded.');
    }
  }
}
