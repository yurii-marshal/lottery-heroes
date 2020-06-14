import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { WalletService } from '../../../../../services/wallet.service';
import { CustomerService } from '../../../../../services/auth/customer.service';
import { GlobalService } from '../../../../../services/global.service';
import { AnalyticsDeprecatedService } from '../../../../../modules/analytics-deprecated/services/analytics-deprecated.service';
import { BrandTranslateService } from '../../../../../modules/brand/services/brand-translate.service';
import { CurrencyService } from '../../../../../services/auth/currency.service';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../../store/reducers/index';
import { LightboxesService } from '../../../../../modules/lightboxes/services/lightboxes.service';

@Component({
  selector: 'app-wish-to-withdraw',
  templateUrl: './wish-to-withdraw.component.html',
  styleUrls: ['./wish-to-withdraw.component.scss'],
})
export class WishToWithdrawComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  isShown = false;
  withdrawForm: FormGroup;
  symbol;
  balance;
  errorObj = {};
  customerStatusId: string;
  successWithdrawResponse = false;
  state: string;
  limitWithdrawCount = 20;
  sessionStatus: string;

  constructor(private store: Store<fromRoot.State>,
              private formBuilder: FormBuilder,
              private walletService: WalletService,
              private customerService: CustomerService,
              private currencyService: CurrencyService,
              private globalService: GlobalService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private brandTranslateService: BrandTranslateService,
              private zone: NgZone,
              private lightboxesService: LightboxesService) {
    this.store.select(fromRoot.getSessionStatus)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((status: string) => this.sessionStatus = status);
  }

  buildForm() {
    this.withdrawForm = this.formBuilder.group({
      'amount': ['', [Validators.required, Validators.pattern(/^[0-9]+((.[0-9]{1,2})|\.)?$/), this.amountValidator.bind(this)]],
      'preferred_payment': ['', []]
    });
  }

  private returnDecimal(num: string): number {
    num ?  num = num.toString() : num = '';
    return num ? (num.split('.')[1] || []).length : null;
  }

  private returnDot(val: string): number {
    val ? val =  val.toString() : val = '';
    return val ? val.indexOf('.') : null;
  }

  amountValidator(control: FormControl): {
    required?: boolean,
    incorrect?: boolean,
    positiveValue?: boolean,
    maxValue?: boolean,
    limitWithdraw?: boolean,
  } {
    const val = Number(control.value);
    const decimal = this.returnDecimal(control.value);
    const dot = this.returnDot(control.value);
    if (control.value === '' || val < this.limitWithdrawCount) {
      return {limitWithdraw: true};
    }
    if (val > this.balance.customer_total) {
      return {maxValue: true};
    }
    if (!val || decimal > 2 || (!( val > Math.floor(val)) && dot !== -1)) {
      return {incorrect: true};
    }
    return null;
  }

  ngOnInit() {
    this.walletService.getCustomerBalance().subscribe(
      balance => {
        this.balance = balance;
        this.buildForm();
      },
      error => console.error('get balance error: ', error)
    );
    this.currencyService.getCurrencySymbol().subscribe(
      symbol => this.symbol = symbol,
      error => console.error('get currency symbol error: ' + error)
    );

    this.customerService.getCustomerStatusId()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(statusId => this.customerStatusId = statusId);
  }

  onTriggerWithdrawModal() {
   if (this.isLimitedActivity() || this.isAccountUnverified()) {
     return;
   }
    this.isShown = !this.isShown;
  }

  isLimitedActivity(): boolean {
    if (this.sessionStatus === 'limited') {
      this.lightboxesService.show({
        type: 'general',
        title: 'Lightboxes.sessionStatusTittle',
        message: 'Lightboxes.sessionStatusMessage',
      });
      return true;
    }

    if (this.customerStatusId === 'limited') {
      this.globalService.showLightbox$.emit({name: 'limited-status', value: ''});
      return true;
    }
    return false;
  }

  isAccountUnverified(): boolean {
    if (this.customerStatusId === 'unverified') {
      this.globalService.showLightbox$.emit({name: 'account-unverified', value: 'not verified'});
      return true;
    }
    return false;
  }

  onCloseLightbox() {
    this.withdrawForm.reset();
    this.successWithdrawResponse = false;
    this.isShown = false;
  }

  onSubmit() {
    this.withdrawForm.controls['amount'].markAsTouched();
    if (this.withdrawForm.valid) {
      this.walletService.customerWithdraw(this.withdrawForm.value.amount, this.withdrawForm.value.preferred_payment).subscribe(
        res => this.successWithdraw(res),
        error => this.errorWithdraw(error)
      );
    }
  }

  successWithdraw(result) {
    this.clearErrorMsg();
    this.onTrackWithdrawSubmit();
    this.successWithdrawResponse = true;

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          // this.onAnimate();
          this.onCloseLightbox();
          this.walletService.loadBalance();
        });
      }, 3000);
    });
  }

  errorWithdraw(response) {
    this.errorObj = this.brandTranslateService.createErrorObj(response, 'amount');
  }

  isErrorField(fieldName: string) {
    return fieldName in this.errorObj;
  }

  onInputWithdraw() {
    this.clearErrorMsg();
  }

  clearErrorMsg() {
    this.errorObj = {};
  }

  onTrackWithdrawSubmit() {
    this.analyticsDeprecatedService.trackWithdrawSubmit(this.withdrawForm.value.amount);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
