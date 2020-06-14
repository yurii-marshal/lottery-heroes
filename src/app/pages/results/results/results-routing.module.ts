import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ResultsContainerComponent } from './containers/results.container.component';
import { LotteriesResolver } from '../../../modules/ex-core/resolvers/lotteries/lotteries.resolver';
import { SyndicatesResolver } from '@libs/biglotteryowin-core/resolvers/syndicates.resolver';
import { LatestDrawsResolver } from '../../../modules/ex-core/resolvers/lotteries/latest-draws.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ResultsContainerComponent,
        resolve: {
          lotteries: LotteriesResolver,
          syndicates: SyndicatesResolver,
          latestDraws: LatestDrawsResolver,
        },
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ResultsRoutingModule {
}
