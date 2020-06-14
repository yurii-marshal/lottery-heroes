import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CustomerAccountComponent } from './components/customer-account.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CustomerAccountComponent,
        children: [
          {
            path: 'details',
            loadChildren: '../details/details.module#DetailsModule',
          },
          {
            path: 'deposit',
            loadChildren: '../deposit/deposit.module#DepositModule',
          },
          {
            path: 'lines',
            loadChildren: '../lines/lines.module#LinesModule',
          },
          {
            path: 'transactions',
            loadChildren: '../transactions/transactions.module#TransactionsModule',
          },
          {
            path: 'my-lucky-numbers',
            loadChildren: '../my-lucky-numbers/my-lucky-numbers.module#MyLuckyNumbersModule',
          }
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class CustomerAccountRoutingModule {
}
