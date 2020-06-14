import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductContainerComponent } from './product.container.component';
import { SyndicatesResolver } from '@libs/biglotteryowin-core/resolvers/syndicates.resolver';
import { LuvCurrenciesResolver } from '../../modules/ex-core/resolvers/luv/luv-currencies.resolver';
import { LuvCountriesResolver } from '../../modules/ex-core/resolvers/luv/luv-countries.resolver';
import { LotterySoldGuard } from '../../modules/ex-core/guards/lottery-sold.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [
      LotterySoldGuard,
    ],
    component: ProductContainerComponent,
    resolve: {
      // Syndicate Resolvers
      syndicates: SyndicatesResolver,

      // Lottery Resolvers
      currencies: LuvCurrenciesResolver,
      countries: LuvCountriesResolver,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {
}
