import { Component, Input } from '@angular/core';
import { TransactionInterface } from '../../../../../services/api/entities/incoming/wallet/transaction.interface';
import { CurrencyService } from '../../../../../services/auth/currency.service';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.scss']
})
export class TransactionItemComponent {
  @Input() transaction: TransactionInterface;
  isOpened = false;
  siteCurrencyId: string;

  constructor(private currencyService: CurrencyService) {
    this.currencyService.getCurrencyId().subscribe(currencyId => this.siteCurrencyId = currencyId);
  }

  onTriggerOpen() {
    this.isOpened = !this.isOpened;
  }

}
