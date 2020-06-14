import {Component, OnInit, OnDestroy, ElementRef, Renderer2, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {WalletService} from '../../../../../services/wallet.service';
import {DomSanitizer} from '@angular/platform-browser';
import {CustomerService} from '../../../../../services/auth/customer.service';
import {GlobalService} from '../../../../../services/global.service';
import {AnalyticsDeprecatedService} from '../../../../../modules/analytics-deprecated/services/analytics-deprecated.service';
import {PaymentSystemInterface} from '../../../../../services/api/entities/incoming/wallet/payment-system.interface';
import {LuvService} from '../../../../../services/luv.service';
import {BrandTranslateService} from '../../../../../modules/brand/services/brand-translate.service';
import {CurrencyService} from '../../../../../services/auth/currency.service';
import {AccountService} from '../../../../../services/account/account.service';
import {DeviceService} from '../../../../../services/device/device.service';
import {BrandParamsService} from '../../../../../modules/brand/services/brand-params.service';
import {EnvironmentService} from '../../../../../services/environment/environment.service';
import {ScrollService} from '../../../../../services/device/scroll.service';
import {Subject} from 'rxjs/Subject';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../../../store/reducers/index';
import {LightboxesService} from '../../../../../modules/lightboxes/services/lightboxes.service';
import * as depositActions from '../../actions/deposit.actions';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {WindowService} from '../../../../../services/device/window.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  depositForm: FormGroup;
  paymentPageUrl;
  isShowDeposit = true;
  isShowIframe = false;
  responseComponent: string | null;
  currencyId: string;
  customerStatusId: string;
  errorObj = {};
  depositTypeId = 1;
  depositStatus = 'approved';
  isShowWiropaySystem = false;
  currentPaymentSystem: PaymentSystemInterface;
  device: string;
  brandPaymentLimited: boolean;
  minimumDeposit: number;
  sessionStatus: string;
  customerDepositLimit: number;
  isIframeLoading: boolean;

  private unbindListenWindowMessageFunc: Function;

  constructor(private store: Store<fromRoot.State>,
              private formBuilder: FormBuilder,
              private walletService: WalletService,
              private sanitizer: DomSanitizer,
              private luvService: LuvService,
              private customerService: CustomerService,
              private currencyService: CurrencyService,
              private globalService: GlobalService,
              private renderer: Renderer2,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private router: Router,
              private brandTranslateService: BrandTranslateService,
              private deviceService: DeviceService,
              private accountService: AccountService,
              private brandParamsService: BrandParamsService,
              private environmentService: EnvironmentService,
              private elementRef: ElementRef,
              private scrollService: ScrollService,
              private lightboxesService: LightboxesService,
              private windowService: WindowService,
              private zone: NgZone) {
    deviceService.getDevice()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(device => this.onChangeDevice(device));
    this.brandParamsService.getConfig('brandPaymentLimited')
      .subscribe(brandPaymentLimited => this.brandPaymentLimited = brandPaymentLimited);
    this.brandParamsService.getConfig('minimumDeposit')
      .subscribe(minimumDeposit => this.minimumDeposit = minimumDeposit);
    this.store.select(fromRoot.getSessionStatus)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((status: string) => this.sessionStatus = status);
  }

  ngOnInit() {
    this.unbindListenWindowMessageFunc = this.renderer.listen('window', 'message', (event) => {
      switch (event.data) {
        case 'payment-success':
          this.onPaymentSuccess();
          break;
        case 'payment-cancel':
          this.onPaymentCancelled();
          break;
        case 'payment-failure':
          this.onPaymentFailed();
          break;
        case 'payment-pending':
          this.onPaymentPending();
          break;
      }
    });

    this.buildForm();
    this.currencyService.getCurrencyId()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(res => this.currencyId = res);

    this.depositForm.valueChanges
      .takeUntil(this.ngUnsubscribe)
      .subscribe(data => this.clearErrorMsg());

    this.customerService.getCustomerStatusId()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(statusId => this.customerStatusId = statusId);

    this.walletService.getCustomerDepositLimits()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(customer => this.customerDepositLimit = customer ? customer.amount : undefined);
  }

  buildForm() {
    this.depositForm = this.formBuilder.group({
      'deposit': ['', [Validators.required,
        this.depositValidator.bind(this),
        Validators.pattern(/^[0-9]+((.[0-9]{1,2})|\.)?$/)]]
    });
  }

  depositValidator(control: FormControl): { minValue?: boolean } | null {
    const val = control.value;
    if (val !== null && val < this.minimumDeposit) {
      return {minValue: true};
    }
    return null;
  }

  onInputDeposit() {
    this.clearErrorMsg();
  }

  onSubmit() {
    if (this.isLimitedActivity() || this.isAccountUnverified()) {
      return;
    }
    this.depositForm.controls['deposit'].markAsTouched();
    if (this.depositForm.valid) {
      const amount = this.depositForm.value.deposit;
      this.walletService.setCurrentDepositAmount(amount);
      if (!this.brandPaymentLimited || (!this.environmentService.getEnvironmentData('paymentLimited') && this.globalService.cashier)) {
        this.identifyPaymentSystem();
      } else {
        this.router.navigate(['/myaccount/deposit/payment-failure-limited']);
      }
    }
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

  identifyPaymentSystem() {
    combineLatest(
      this.luvService.getPaymentSystems(),
      this.walletService.getCurrentPaymentSystem()
    ).subscribe(
      res => {
        const paymentSystems = res[0];
        this.currentPaymentSystem = res[1];
        switch (this.currentPaymentSystem.mode) {
          case 's2s':
            this.useS2SModeForDeposit();
            break;
          case 'iframe':
            this.useIframeModeForDeposit();
            break;
          case 'apcopay':
            this.isShowDeposit = false;
            this.useIframeModeForDeposit();
            break;
        }
      },
      error => console.error('identify payment system', error)
    );
  }

  useS2SModeForDeposit() {
    if (this.customerDepositLimit && this.customerDepositLimit < this.depositForm.value.deposit) {
      this.errorObj = this.brandTranslateService.createErrorObj({details: {property: 'deposit', code: 'daily_limit'}}, 'deposit');
    } else {
      this.walletService.loadCustomerCards();
      this.isShowWiropaySystem = true;
      this.isShowDeposit = false;
      this.ontrackDepositFormPresented();
    }
  }

  useIframeModeForDeposit() {
    const amount = this.depositForm.value.deposit;
    this.walletService.getTransactionsCount({typeId: this.depositTypeId, status: this.depositStatus})
      .switchMap((res: { count: number }) => {
        this.walletService.setCurrentDepositTransactionCount(res.count);
        return this.walletService.deposit({
          amount: amount
        });
      }).subscribe(
      res => this.successDeposit(res),
      error => this.errorDeposit(error)
    );
  }

  successDeposit(res) {
    if (this.currentPaymentSystem.mode === 'apcopay') {
      if (document.getElementById('apco-iframe')) {
        this.renderer.removeChild(document.getElementById('form-container'), document.getElementById('frame-form'));
        this.renderer.removeChild(document.getElementById('frame-container'), document.getElementById('apco-iframe'));
      }
      this.isIframeLoading = true;
      const frameForm = this.renderer.createElement('form');
      this.renderer.setProperty(frameForm, 'action', 'https://www.apsp.biz/pay/FP5a/Checkout.aspx');
      this.renderer.setProperty(frameForm, 'method', 'post');
      this.renderer.setProperty(frameForm, 'enctype', 'application/x-www-form-urlencoded');
      this.renderer.setProperty(frameForm, 'target', 'apco-iframe');
      this.renderer.setProperty(frameForm, 'id', 'frame-form');
      this.renderer.appendChild(document.getElementById('form-container'), frameForm);

      const formInput = this.renderer.createElement('input');
      this.renderer.setProperty(formInput, 'name', 'params');
      this.renderer.setProperty(formInput, 'id', 'form-input');
      this.renderer.setProperty(formInput, 'value', res.xml);
      this.renderer.setProperty(formInput, 'style', 'display: none');
      this.renderer.setProperty(formInput, 'type', 'submit');
      this.renderer.appendChild(document.getElementById('frame-form'), formInput);
      // this.walletService.getApcoPayUrlFromXML(res.xml, (url) => {
      //   this.showIframe(url);
      // });

      const apcoFrame = this.renderer.createElement('iframe');
      this.renderer.setProperty(apcoFrame, 'id', 'apco-iframe');
      this.renderer.setProperty(apcoFrame, 'name', 'apco-iframe');
      this.renderer.setProperty(apcoFrame, 'width', '420');
      this.renderer.setProperty(apcoFrame, 'height', '550');
      this.renderer.appendChild(document.getElementById('frame-container'), apcoFrame);

      const xmlEl = document.getElementById('form-input');
      xmlEl.click();
      document.getElementById('apco-iframe').addEventListener('load', () => {
        this.isIframeLoading = false;
      });
    } else {
      this.showIframe(res.payment_page_url);
    }
  }

  errorDeposit(response) {
    if (response.details.code === 'over_daily_limit') {
      this.globalService.showLightbox$.emit({name: response.details.property, value: ''});
    }
    this.errorObj = this.brandTranslateService.createErrorObj(response, 'deposit');
  }

  showIframe(url) {
    this.ontrackDepositFormPresented();
    this.paymentPageUrl = this.createIframeURL(url);
    this.isShowIframe = true;
    this.isShowDeposit = false;
  }

  isErrorField(fieldName: string) {
    return fieldName in this.errorObj;
  }

  clearErrorMsg() {
    this.errorObj = {};
  }

  createIframeURL(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onPaymentSuccess() {
    this.walletService.loadBalanceUntilChange(1000);
    this.showResponseComponent('success');
    if (this.device === 'mobile') {
      this.scrollService.scrollToSmooth(this.elementRef.nativeElement);
    }
    this.hideResponseComponent();
    this.store.dispatch(new depositActions.DepositSuccess());
  }

  onPaymentFailed() {
    this.showResponseComponent('failed');
    this.hideResponseComponent();
  }

  onPaymentCancelled() {
    this.showResponseComponent('cancelled');
    this.hideResponseComponent();
  }

  onPaymentPending() {
    this.showResponseComponent('pending');
    this.hideResponseComponent();
  }

  showResponseComponent(name: string) {
    this.isShowWiropaySystem = false;
    this.responseComponent = name;
    this.paymentPageUrl = null;
    this.isShowIframe = false;
    this.isShowDeposit = false;
    this.depositForm.controls['deposit'].setValue('');
    this.depositForm.controls['deposit'].markAsUntouched();
    this.clearErrorMsg();
  }

  hideResponseComponent() {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          this.responseComponent = null;
          this.isShowDeposit = true;
        });
      }, 3000);
    });
  }

  ontrackDepositFormPresented() {
    this.analyticsDeprecatedService.trackDepositFormPresented('external');
  }

  onChangeDevice(device) {
    this.device = device;
  }

  onBackToMenu() {
    this.accountService.emitClick('from-back');
  }

  ngOnDestroy() {
    this.unbindListenWindowMessageFunc();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
