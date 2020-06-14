import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthService} from '../../../../services/auth/auth.service';
import {WalletService} from '../../../../services/wallet.service';
import {MetaService} from '../../../../modules/meta/services/meta.service';
import {BalanceInterface} from '../../../../services/api/entities/incoming/wallet/balance.interface';
import {NavigationEnd, Router} from '@angular/router';
import {DeviceService} from '../../../../services/device/device.service';
import {Subscription} from 'rxjs/Subscription';
import {CurrencyService} from '../../../../services/auth/currency.service';
import {AccountService} from '../../../../services/account/account.service';
import {AnalyticsDeprecatedService} from '../../../../modules/analytics-deprecated/services/analytics-deprecated.service';
import {PlatformLocation} from '@angular/common';
import {WebStorageService} from '../../../../services/storage/web-storage.service';

@Component({
  selector: 'app-user',
  templateUrl: './customer-account.component.html',
  styleUrls: ['./customer-account.component.scss']
})
export class CustomerAccountComponent implements OnInit, OnDestroy {
  balance$;
  siteCurrencySymbol$;
  deviceSubscription: Subscription;
  device: string;
  isOpenOutlet: boolean;
  activeLink: string;

  constructor(private authService: AuthService,
              private walletService: WalletService,
              private currencyService: CurrencyService,
              private metaService: MetaService,
              private deviceService: DeviceService,
              private router: Router,
              private accountService: AccountService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private webStorageService: WebStorageService,
              private location: PlatformLocation) {
    accountService.clickEvent$.subscribe(data => {
      if (data === 'from-menu') {
        this.isOpenOutlet = true;
      } else if (data === 'from-back') {
        this.isOpenOutlet = false;
        this.activeLink = 'myaccount';
      }
    });
  }

  ngOnInit() {
    this.deviceSubscription = this.deviceService.getDevice().subscribe(device => {
      this.onChangeDevice(device);
      this.parseActiveLink();
      this.onLoadOutlet();
      this.onClickBrowserBack();
    });

    this.authService.getCurrentCustomer().subscribe(
      (customer) => {
        this.authService.saveCurrentUserObj(customer);
        this.authService.setCurrentUserLanguage(customer);
      },
      (error) => this.authService.clearCurrentUser()
    );
    this.siteCurrencySymbol$ = this.currencyService.getCurrencySymbol();
    this.balance$ = this.walletService.getCustomerBalance()
      .filter((balance: BalanceInterface) => !!balance)
      .map((balance: BalanceInterface) => balance.customer_total)
      .startWith(0);

    this.metaService.setFromConfig('page', 'myaccount');
  }

  onLoadOutlet() {
    this.isOpenOutlet = true;
    if (this.activeLink === 'myaccount') {
      if (this.device === 'desktop') {
        this.router.navigate(['/myaccount/details']);
        this.onClickLink('details');
      } else {
        this.isOpenOutlet = false;
      }
    } else {
      this.isOpenOutlet = true;
    }
  }

  parseActiveLink() {
    let url = this.router.url;
    const position = this.router.url.indexOf('?');
    if (position !== -1) {
      url = url.substring(0, position);
    }
    this.activeLink = url.substring(url.lastIndexOf('/') + 1);
  }

  onChangeDevice(device) {
    this.device = device;
  }

  onClickLink(linkName: string) {
    this.isOpenOutlet = true;
    this.activeLink = linkName;
  }

  onClickBrowserBack() {
    this.location.onPopState(() => {
      this.router.events
        .filter(event => event instanceof NavigationEnd)
        .subscribe(() => {
          this.parseActiveLink();
          this.onLoadOutlet();
        });
    });
  }

  onLogout() {
    // const lang_id = this.translateService.currentLang === 'en' ? null : this.translateService.currentLang;
    this.router.navigate(['']);
    this.authService.logout();
  }

  onTrackMenuClicked(option: string) {
    this.analyticsDeprecatedService.trackAccountMenuClicked(option);
  }

  ngOnDestroy() {
    this.deviceSubscription.unsubscribe();
  }
}
