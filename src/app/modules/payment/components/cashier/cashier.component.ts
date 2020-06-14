import {ChangeDetectorRef, Component, Input, NgZone, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {CustomerCardInterface} from '../../../../services/api/entities/incoming/wallet/customer-card.interface';
import {WalletService} from '../../../../services/wallet.service';
import {CreditCardValidator} from '../../../shared/validators/credit-card.validator';
import {OrderInterface} from '../../../../services/api/entities/incoming/wallet/order.interface';
import {DepositAndBuyInterface} from '../../../../services/api/entities/incoming/wallet/deposit-and-buy.interface';
import {CustomerService} from '../../../../services/auth/customer.service';
import {CustomerInterface} from '../../../../services/auth/entities/interfaces/customer.interface';
import {AnalyticsDeprecatedService} from '../../../analytics-deprecated/services/analytics-deprecated.service';
import {BrandTranslateService} from '../../../brand/services/brand-translate.service';
import {Subscription} from 'rxjs/Subscription';
import {CurrencyService} from '../../../../services/auth/currency.service';
import {BrandParamsService} from '../../../brand/services/brand-params.service';
import {GlobalService} from '../../../../services/global.service';
import {LightboxesService} from '../../../lightboxes/services/lightboxes.service';
import {IOption} from 'ng-select';
import {CurrencyPipe} from '@angular/common';
import {DepositLimitInterface} from '../../../../services/api/entities/incoming/wallet/deposit-limit.interface';
import {LuvService} from '../../../../services/luv.service';

import * as fromRoot from '../../../../store/reducers/index';
import * as walletActions from '../../../../store/actions/wallet.actions';
import {Store} from '@ngrx/store';

import * as cashierActions from '../../actions/cashier.actions';
import * as depositActions from '../../../../pages/customer-feature/deposit/actions/deposit.actions';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {interval} from 'rxjs/observable/interval';
import {first} from 'rxjs/operators';
import {race} from 'rxjs/observable/race';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.scss'],
  providers: [CurrencyPipe]
})
export class CashierComponent implements OnInit, OnDestroy {
  @Input() action: string;

  // BrandParams
  isShowChat: boolean;
  closeChatSubject$ = new Subject();
  showChatTimeout = 5000;

  paymentSystem = 'apcopay';
  currentPaymentSystem: { mode?: string, is_active?: number };
  paymentForm: FormGroup;
  formSubscription: Subscription;
  paymentSystemSubscription: Subscription;
  months = new Array(12);
  currentYear = new Date().getFullYear();
  years = new Array(41);
  customerCards: CustomerCardInterface[] = [];
  selectedCard: CustomerCardInterface = null;
  amount: number;
  siteCurrencyId: string;
  depositAndBuyObj: DepositAndBuyInterface;
  customerObj: CustomerInterface;
  depositTypeId = 1;
  purchaseTypeId = 3;
  depositStatus = 'approved';
  depositCount: number;
  isFirstDeposit = false;
  depositLimitObj: DepositLimitInterface;
  errorObj = {};
  errorForGA = {
    creditCardNumber: false,
    month: false,
    year: false,
    cvv: false,
    firstName: false,
    lastName: false,
    name_on_card: false,
  };

  creditCardNiceType = {
    'visa': 'Visa',
    'master-card': 'MasterCard',
    'american-express': 'American Express',
    'diners-club': 'Diners Club',
    'discover': 'Discover',
    'jcb': 'JCB',
    'unionpay': 'UnionPay',
    'maestro': 'Maestro'
  };

  lightboxErrorCodes = [
    'try_another_card',
    'temporary_error',
    're-check_card_details',
    'insufficient_funds_or_card_maxed_out',
    'card_not_supported',
    'general_error',
    'suspicious_card'
  ];

  submitInProgress = false;

  // ng-select
  optionsListLimit: Array<IOption> = [];
  optionsListCards: Array<IOption> = [];
  optionsListMonth: Array<IOption> = [];
  optionsListYear: Array<IOption> = [];

  constructor(private formBuilder: FormBuilder,
              private walletService: WalletService,
              private changeDetectorRef: ChangeDetectorRef,
              private customerService: CustomerService,
              private currencyService: CurrencyService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private brandTranslateService: BrandTranslateService,
              private brandParamsService: BrandParamsService,
              private globalService: GlobalService,
              private lightboxesService: LightboxesService,
              private currencyPipe: CurrencyPipe,
              private luvService: LuvService,
              private store: Store<fromRoot.State>,
              private zone: NgZone) {
    this.paymentSystemSubscription = this.walletService.getCurrentPaymentSystem()
      .subscribe(paymentSystem => this.currentPaymentSystem = paymentSystem);
    this.customerService.getCustomer().subscribe((customer: CustomerInterface) => this.customerObj = customer);
    this.walletService.getCurrentDepositAmount().filter(amount => !!amount).subscribe(amount => this.amount = amount);
    this.currencyService.getCurrencyId().subscribe(currencyId => this.siteCurrencyId = currencyId);
    this.walletService.getDepositAndBuyObj().subscribe(
      (depositAndBuyObj: DepositAndBuyInterface) => this.depositAndBuyObj = depositAndBuyObj
    );

    forkJoin(
      this.walletService.getTransactionsCount({typeId: this.depositTypeId, status: this.depositStatus}),
      this.walletService.getCustomerDepositLimits()
    ).subscribe(
      (res) => {
        this.depositCount = res[0].count;
        this.depositLimitObj = res[1];
        this.isFirstDeposit = (this.depositCount === 0 && !this.depositLimitObj) ? true : false;
      }
    );

    this.optionsListLimit.push(
      {
        value: '50000',
        label: this.currencyPipe.transform('50000', this.siteCurrencyId, 'symbol', '1.0-1')
      },
      {
        value: '25000',
        label: this.currencyPipe.transform('25000', this.siteCurrencyId, 'symbol', '1.0-1')
      },
      {
        value: '5000',
        label: this.currencyPipe.transform('5000', this.siteCurrencyId, 'symbol', '1.0-1')
      },
      {
        value: '1000',
        label: this.currencyPipe.transform('1000', this.siteCurrencyId, 'symbol', '1.0-1')
      },
      {
        value: '500',
        label: this.currencyPipe.transform('500', this.siteCurrencyId, 'symbol', '1.0-1')
      }
    );

    for (let i = 0; i < 12; i++) {
      this.optionsListMonth.push(
        {
          value: i < 9 ? '0' + (i + 1).toString() : (i + 1).toString(),
          label: i < 9 ? '0' + (i + 1).toString() : (i + 1).toString()
        }
      );
    }

    for (let i = this.currentYear; i < this.currentYear + 41; i++) {
      this.optionsListYear.push(
        {
          value: i.toString(),
          label: i.toString()
        }
      );
    }
  }

  ngOnInit() {
    this.buildForm();
    this.walletService.getCustomerCards()
      .filter(customerCards => !!customerCards)
      .subscribe(customerCards => {
          this.customerCards = customerCards;
          this.selectedCard = null;
          if (customerCards.length > 0) {
            this.selectedCard = this.customerCards[0];
            this.paymentForm.controls['cards'].setValue('0');
            this.changeDetectorRef.markForCheck();

            for (let i = 0; i < this.customerCards.length; i++) {
              this.optionsListCards.push({
                value: i.toString(),
                label: (this.creditCardNiceType[this.customerCards[i].type] + ' - ' + this.customerCards[i].number_last4).toString()
              });
            }

            this.optionsListCards.push({value: '', label: 'Add a new card'});
          }
        }
      );

    this.brandParamsService.getConfig('isShowChat').subscribe(configValue => this.isShowChat = configValue);
  }

  buildForm() {
    this.paymentForm = this.formBuilder.group({
      'cards': [''],
      'name_on_card': ['', [Validators.required]],
      'card_number': ['', [
        Validators.required, Validators.pattern(/^[0-9 ]+$/), CreditCardValidator.cardTypeCheck,
        CreditCardValidator.luhnCheck]],
      'expire_month': ['', [Validators.required]],
      'expire_year': ['', [Validators.required]],
      'cvv': ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(4),
        Validators.pattern(/^[0-9]{1,4}?$/)]]
    });

    this.formSubscription = this.paymentForm.valueChanges.subscribe(data => {
      this.clearErrorMessages();
    });
  }

  onSubmit() {
    if (this.submitInProgress === true) {
      return;
    }

    for (const cont in this.paymentForm.controls) {
      if (this.paymentForm.controls.hasOwnProperty(cont)) {
        this.paymentForm.controls[cont].markAsTouched();
      }
    }

    if (this.depositLimitObj && this.isFirstDeposit) {
      this.updateDepositLimit().subscribe(
        res => this.checkAction(),
        error => console.error('LimitsUpdate error', error)
      );
      return;
    }
    this.checkAction();
  }

  checkAction() {
    this.submitInProgress = true;
    this.changeDetectorRef.markForCheck();
    switch (this.action) {
      case 'deposit':
        this.onDeposit();
        break;
      case 'depositAndBuy':
        this.onDepositAndBuy();
        break;
    }
  }

  onDeposit() {
    this.clearErrorMessages();
    if (this.selectedCard) {
      this.depositWithOldCard();
    } else {
      this.depositWithNewCard();
    }
  }

  depositWithNewCard() {
    this.onTrackDepositSubmitted();
    if (this.paymentForm.valid) {
      const formValue = this.paymentForm.value;
      const depositObj = {
        amount: this.amount,
        card_number: formValue.card_number,
        cvv: formValue.cvv,
        owner_first_name: formValue.first_name,
        owner_last_name: formValue.last_name,
        expire_year: formValue.expire_year,
        expire_month: formValue.expire_month,
        name_on_card: formValue.name_on_card,
      };
      this.walletService.getTransactionsCount({typeId: this.depositTypeId, status: this.depositStatus})
        .switchMap((res: { count: number }) => {
          this.walletService.setCurrentDepositTransactionCount(res.count);
          return this.walletService.deposit(depositObj);
        }).subscribe(
        res => this.onSuccessDeposit(res),
        error => this.onErrorDeposit(error)
      );
    } else {
      this.submitInProgress = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  depositWithOldCard() {
    this.onTrackDepositSubmitted();
    if (this.paymentForm.controls['cvv'].valid) {
      const depositObj = {
        amount: this.amount,
        customer_card_id: this.selectedCard.id,
        cvv: this.paymentForm.controls['cvv'].value
      };

      forkJoin(
        this.walletService.getTransactionsCount({typeId: this.depositTypeId, status: this.depositStatus}),
        this.walletService.getTransactionsCount({typeId: this.purchaseTypeId, status: this.depositStatus})
      )
        .switchMap((data) => {
          this.walletService.setCurrentDepositTransactionCount(data[0].count);
          this.walletService.setCurrentPurchaseTransactionCount(data[1].count);
          return this.walletService.deposit(depositObj);
        })
        .subscribe(
          res => this.onSuccessDeposit(res),
          error => this.onErrorDeposit(error)
        );
    } else {
      this.submitInProgress = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  onDepositAndBuy() {
    if (this.selectedCard) {
      this.depositAndBuyWithOldCard();
    } else {
      this.depositAndBuyWithNewCard();
    }
  }

  depositAndBuyWithOldCard() {
    this.onTrackDepositSubmitted();
    if (this.paymentForm.controls['cvv'].valid) {
      const depositAndBuyObj = Object.assign({
        customer_card_id: this.selectedCard.id,
        cvv: this.paymentForm.controls['cvv'].value,
      }, this.depositAndBuyObj);

      forkJoin(
        this.walletService.getTransactionsCount({typeId: this.depositTypeId, status: this.depositStatus}),
        this.walletService.getTransactionsCount({typeId: this.purchaseTypeId, status: this.depositStatus}),
        this.store.select(fromRoot.getSkipFirstDrawParam).first(),
      )
        .first()
        .switchMap((data) => {
          this.walletService.setCurrentDepositTransactionCount(data[0].count);
          this.walletService.setCurrentPurchaseTransactionCount(data[1].count);
          return this.walletService.depositAndBuy(depositAndBuyObj, data[2]);
        }).subscribe(
        (response: { order: OrderInterface, payment_page_url: string }) => {
          this.store.dispatch(new walletActions.SetSkipFirstDrawParam(null));
          this.onSuccessDeposit(response);
          this.analyticsDeprecatedService.trackFirstPurchase('Deposit');
          this.walletService.setCurrentOrderObj(response.order);
        },
        error => this.onErrorDeposit(error));
    } else {
      this.submitInProgress = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  depositAndBuyWithNewCard() {
    this.onTrackDepositSubmitted();
    if (this.paymentForm.valid) {
      const formValue = this.paymentForm.value;
      const depositAndBuyObj = Object.assign({
        card_number: formValue.card_number,
        cvv: formValue.cvv,
        name_on_card: formValue.name_on_card,
        expire_year: formValue.expire_year,
        expire_month: formValue.expire_month,
      }, this.depositAndBuyObj);

      forkJoin(
        this.walletService.getTransactionsCount({typeId: this.depositTypeId, status: this.depositStatus}),
        this.walletService.getTransactionsCount({typeId: this.purchaseTypeId, status: this.depositStatus}),
        this.store.select(fromRoot.getSkipFirstDrawParam).first()
      )
        .first()
        .switchMap((data) => {
          this.walletService.setCurrentDepositTransactionCount(data[0].count);
          this.walletService.setCurrentPurchaseTransactionCount(data[1].count);
          return this.walletService.depositAndBuy(depositAndBuyObj, data[2]);
        }).subscribe(
        (response: { order: OrderInterface, payment_page_url: string }) => {
          this.store.dispatch(new walletActions.SetSkipFirstDrawParam(null));
          this.onSuccessDeposit(response);
          this.analyticsDeprecatedService.trackFirstPurchase('Deposit');
          this.walletService.setCurrentOrderObj(response.order);
        },
        error => this.onErrorDeposit(error)
      );
    } else {
      this.submitInProgress = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  onSuccessDeposit(res) {
    this.isFirstDeposit = false;
    this.changeDetectorRef.markForCheck();
    switch (res.status) {
      case 'approved':
        frames.postMessage('payment-success', '*');
        break;
      case 'rejected':
      case 'pending':
        this.showErrorLightbox('temporary_error');
        break;
    }

    setTimeout(() => {
      this.submitInProgress = false;
      this.changeDetectorRef.markForCheck();
    }, 1000);
  }

  onErrorDeposit(response) {
    this.isFirstDeposit = false;
    this.changeDetectorRef.markForCheck();

    if ('details' in response) {
      if (response.details.code === 'over_daily_limit') {
        this.globalService.showLightbox$.emit({name: response.details.property, value: ''});
      }
      if (response.details[0] && response.details[0].code === 'Validation error') {
        this.showErrorLightbox('temporary_error');
      }
      if (this.lightboxErrorCodes.indexOf(response.details.code) !== -1) {
        this.showErrorLightbox(response.details.code);
      }
      this.errorObj = this.brandTranslateService.createErrorObj(response, 'cards');
      this.changeDetectorRef.markForCheck();
    } else {
      this.showErrorLightbox('temporary_error');
    }

    setTimeout(() => {
      this.submitInProgress = false;
      this.changeDetectorRef.markForCheck();
    }, 1000);
  }

  showErrorLightbox(code: string) {
    this.lightboxesService.show({
      type: 'general',
      closeHandler: () => {
        this.closeChatSubject$.next();
      },
      message: 'CashierComponent.error_' + code,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.closeChatSubject$.next();
          }
        }
      ]
    });

    this.showChatOnDepositError();
  }

  showChatOnDepositError(): void {
    SnapEngage.clearAllCookies();

    race(
      this.closeChatSubject$,
      interval(this.showChatTimeout),
    )
      .pipe(
        first()
      )
      .subscribe(() =>
        SnapEngage.openProactiveChat(true, true, `Hi there!<br>
        Looks like there's a hitch with completing your transaction.<br>
        I'm here for you, how can I help?`)
      );
  }

  isErrorField(fieldName: string) {
    return fieldName in this.errorObj;
  }

  clearErrorMessages() {
    this.errorObj = {};
    this.changeDetectorRef.markForCheck();
  }

  onSelectCard() {
    const selectedCardValue = this.paymentForm.controls['cards'].value;
    this.buildForm();
    this.clearErrorMessages();
    if (selectedCardValue !== '') {
      this.selectedCard = this.customerCards[selectedCardValue];
      this.paymentForm.controls['cards'].setValue(selectedCardValue);
      this.paymentForm.controls['expire_month'].setValue(this.selectedCard.expire_month);
      this.paymentForm.controls['expire_year'].setValue(this.selectedCard.expire_year);
      this.paymentForm.controls['name_on_card'].setValue(this.selectedCard.name_on_card);
    } else {
      this.onAddAnotherCard();
    }
  }

  onAddAnotherCard() {
    this.clearErrorMessages();
    this.selectedCard = null;
  }

  // validate credit card exp date
  onChangeDate() {
    const month = this.paymentForm.controls['expire_month'].value;
    const year = this.paymentForm.controls['expire_year'].value;
    if (month !== '' && year !== '') {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      if (currentYear === +year && currentMonth > +month) {
        this.paymentForm.controls['expire_month'].setErrors({'required': true});
      } else {
        this.paymentForm.controls['expire_month'].setErrors(null);
      }
    }
    this.changeDetectorRef.markForCheck();
  }

  onShowCvvLightbox(): void {
    this.lightboxesService.show({
      type: 'general',
      title: '<h1>CVV/CVC</h1>',
      message: '<img src="assets/images/svg/cvv.svg" alt="cvv"/>',
    });
  }

  showFrontendError(field: string) {
    if (!this.errorForGA[field]) {
      this.errorForGA[field] = true;
    }
    return 'has-error';
  }

  hideFrontendError(field: string) {
    if (this.errorForGA[field]) {
      this.errorForGA[field] = false;
    }
    return '';
  }

  updateDepositLimit() {
    return this.walletService.customerDepositeLimitsUpdate(this.depositLimitObj.amount, this.depositLimitObj.type);
  }

  showDepositLimitModal() {
    this.lightboxesService.show({
      type: 'deposit-limit',
      payload: this.luvService.getDepositLimitsConfig(),
      buttons: [
        {
          text: 'Set Playing Limit',
          type: 'save',
          handler: (depositLimit) => {
            this.onCloseDepositLimitModal(depositLimit);
          }
        },
      ]
    });

    this.store.dispatch(new cashierActions.ClickNewPlayingLimit());
  }

  onCloseDepositLimitModal(depositLimit: DepositLimitInterface) {
    this.depositLimitObj = depositLimit;
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
    this.paymentSystemSubscription.unsubscribe();
    this.selectedCard = null;
    this.walletService.setCustomerCards(null);
  }

  // Analytics
  onTrackFieldBlur(field: string) {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          if (this.errorForGA[field]) {
            this.analyticsDeprecatedService.trackDepositFieldError(field);
          } else {
            this.analyticsDeprecatedService.trackDepositFieldClicked(field);
          }
        });
      }, 200);
    });
  }

  onTrackDepositSubmitted() {
    const label = this.action === 'deposit' ? 'external' : 'checkout';
    this.store.dispatch(new depositActions.DepositSubmitted({label}));

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          for (const field in this.errorForGA) {
            if (this.errorForGA[field]) {
              this.analyticsDeprecatedService.trackDepositFieldError(field);
            }
          }
        });
      }, 400);
    });
  }

  onTrackLiveChatClicked(): void {
    this.store.dispatch(new cashierActions.ClickLiveChat());
  }

  onTrackSupportEmailClicked(): void {
    this.store.dispatch(new cashierActions.ClickSupportEmail());
  }
}
