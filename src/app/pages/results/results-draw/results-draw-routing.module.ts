import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ResultsDrawComponent } from './components/results-draw/results-draw.component';
import { LotteriesResolver } from '../../../modules/ex-core/resolvers/lotteries/lotteries.resolver';
import { SyndicatesResolver } from '@libs/biglotteryowin-core/resolvers/syndicates.resolver';
import { DrawExistsGuard } from '../../../modules/ex-core/guards/draw-exists.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ResultsDrawComponent,
        resolve: {
          lotteries: LotteriesResolver,
          syndicates: SyndicatesResolver,
        },
        canActivate: [
          DrawExistsGuard,
        ],
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ResultsDrawRoutingModule {
}
