import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { TransactionItemComponent } from './components/transaction-item/transaction-item.component';
import { SharedModule } from '../../../modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    TranslateModule,
    SharedModule,
  ],
  declarations: [TransactionsComponent, TransactionListComponent, TransactionItemComponent]
})
export class TransactionsModule { }
