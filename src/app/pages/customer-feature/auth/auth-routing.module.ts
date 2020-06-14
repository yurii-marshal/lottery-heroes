import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthComponent } from './components/auth/auth.component';
import { UpcomingDrawsResolver } from '../../../modules/ex-core/resolvers/lotteries/upcoming-draws.resolver';
import { LotteriesResolver } from '../../../modules/ex-core/resolvers/lotteries/lotteries.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: AuthComponent, resolve: {
        lotteries: LotteriesResolver,
        upcomingDraws: UpcomingDrawsResolver,
      }}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule {
}
