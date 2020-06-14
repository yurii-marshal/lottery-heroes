import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { AuthService } from '../../../../../services/auth/auth.service';
import { WalletService } from '../../../../../services/wallet.service';

import { BalanceInterface } from '../../../../../services/api/entities/incoming/wallet/balance.interface';
import { AnalyticsDeprecatedService } from '../../../../analytics-deprecated/services/analytics-deprecated.service';
import { CurrencyService } from '../../../../../services/auth/currency.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {
  siteCurrencyId: string;
  balance$: Observable<BalanceInterface>;

  @Output() hideDropdown: EventEmitter<string> = new EventEmitter<string>();

  constructor(private authService: AuthService,
              private router: Router,
              private walletService: WalletService,
              private currencyService: CurrencyService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService) {
    this.currencyService.getCurrencyId().subscribe(currencyId => this.siteCurrencyId = currencyId);
  }

  ngOnInit() {
    this.balance$ = this.walletService.getCustomerBalance();
  }

  onLogout() {
      // const lang_id = this.translateService.currentLang === 'en' ? null : this.translateService.currentLang;
      this.router.navigate(['']);
    this.authService.logout();
  }

  hideOpenedDropDown() {
    this.hideDropdown.emit();
  }

  onTrackNavigationClicked(titleName: string) {
    this.analyticsDeprecatedService.trackNavigationClicked(titleName);
  }

}
