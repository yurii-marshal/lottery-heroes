import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ResultsLotteryComponent } from './components/results-lottery/results-lottery.component';
import { LotteriesResolver } from '../../../modules/ex-core/resolvers/lotteries/lotteries.resolver';
import { SyndicatesResolver } from '@libs/biglotteryowin-core/resolvers/syndicates.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ResultsLotteryComponent,
        resolve: {
          lotteries: LotteriesResolver,
          syndicates: SyndicatesResolver,
        },
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ResultsLotteryRoutingModule {
}
