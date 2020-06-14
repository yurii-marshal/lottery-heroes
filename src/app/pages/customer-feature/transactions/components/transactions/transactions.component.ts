import {Component, OnDestroy, OnInit} from '@angular/core';
import {WalletService} from '../../../../../services/wallet.service';
import {AccountService} from '../../../../../services/account/account.service';
import {DeviceService} from '../../../../../services/device/device.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnDestroy {
  transactions;
  deviceSubscription: Subscription;
  device: string;

  constructor(private walletService: WalletService,
              private deviceService: DeviceService,
              private accountService: AccountService) {
    this.deviceSubscription = deviceService.getDevice().subscribe(device => this.onChangeDevice(device));
  }

  ngOnInit() {
    this.walletService.getCustomerTransactions()
      .map(transactions => transactions.filter(itemTransactions =>
        (itemTransactions.status !== 'cancelled' &&
          itemTransactions.status !== 'rejected' &&
          itemTransactions.status !== 'open')))
      .subscribe(
        (res) => {
          this.transactions = res;
        },
        (error) => {
          console.error('TransactionError: ', error);
        }
      );
  }

  onChangeDevice(device) {
    this.device = device;
  }

  onBackToMenu() {
    this.accountService.emitClick('from-back');
  }

  ngOnDestroy() {
    this.deviceSubscription.unsubscribe();
  }

}
