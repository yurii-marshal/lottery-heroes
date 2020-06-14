import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TransactionsComponent } from './components/transactions/transactions.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: TransactionsComponent}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class TransactionsRoutingModule {
}
