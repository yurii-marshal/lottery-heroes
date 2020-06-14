import { Component, Input } from '@angular/core';
import { TransactionInterface } from '../../../../../services/api/entities/incoming/wallet/transaction.interface';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent {
  @Input() transactions: Array<TransactionInterface>;

  constructor() {
  }

}
