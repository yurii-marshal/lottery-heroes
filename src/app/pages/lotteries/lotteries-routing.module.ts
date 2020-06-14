import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LotteriesContainerComponent } from './lotteries-container.component';
import { LotteriesResolver } from '@libs/biglotteryowin-core/resolvers/lotteries.resolver';
import { SyndicatesResolver } from '@libs/biglotteryowin-core/resolvers/syndicates.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: LotteriesContainerComponent,
        resolve: {
          lotteries: LotteriesResolver,
          syndicates: SyndicatesResolver,
        },
      }
    ])
  ],
  exports: [RouterModule]
})
export class LotteriesRoutingModule {
}
