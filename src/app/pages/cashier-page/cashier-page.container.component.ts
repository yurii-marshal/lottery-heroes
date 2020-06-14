import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {CashierPageSandbox} from './cashier-page.sandbox';
import {BalanceInterface} from '../../services/api/entities/incoming/wallet/balance.interface';
import {OfferingsTotalPriceInterface} from '../../modules/api/entities/incoming/offerings/offerings-total-price.interface';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {combineLatest} from 'rxjs/observable/combineLatest';
import * as depositActions from '../customer-feature/deposit/actions/deposit.actions';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../store/reducers';
import {WalletService} from '../../services/wallet.service';

@Component({
  selector: 'app-cashier-page-container',
  template: `
    <ng-container *ngIf="isApcoPayIframeXML">
      <app-steps [activeStep]="2" class="hidden-sm-down" [secondStepText]="'BuyingTicketsStepsComponent.purchase' | translate"></app-steps>
      <div style="position: relative; width: 100%">
        <div *ngIf="isIframeLoading"
             style="position: absolute; margin: 0 auto; width: 100%;
           height: 550px; display: flex; justify-content: center;
           align-items: center" id="ap-spinner">
          <img style="width: 50px;" src="./../assets/images/loader/gif-load.gif" alt="gif"/>
        </div>
      </div>
      <div id="form-container"></div>
      <div id="frame-container" style="display: flex"></div>
    </ng-container>

    <ng-container *ngIf="isPaymentIframeUrl">
      <app-steps [activeStep]="2" class="hidden-sm-down" [secondStepText]="'BuyingTicketsStepsComponent.purchase' | translate"></app-steps>
      <app-iframe [paymentIframeUrl]="paymentIframeUrl"></app-iframe>
    </ng-container>

    <ng-container *ngIf="isShowWiropaySystem">
      <app-steps [activeStep]="2" class="hidden-sm-down" [secondStepText]="'BuyingTicketsStepsComponent.purchase' | translate"></app-steps>
      <app-cashier [action]="'depositAndBuy'"></app-cashier>
    </ng-container>
  `,
})
export class CashierPageContainerComponent implements OnInit, OnDestroy {
  paymentIframeUrl: SafeResourceUrl;
  isShowWiropaySystem = false;
  isPaymentIframeUrl = false;
  isApcoPayIframeXML = false;
  isIframeLoading = false;

  private unbindListenWindowMessageFunc: Function;

  constructor(private sandbox: CashierPageSandbox,
              private router: Router,
              private sanitizer: DomSanitizer,
              private renderer: Renderer2,
              private walletService: WalletService,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit(): void {
    this.sandbox.setMeta();
    this.checkout();
    this.unbindListenWindowMessageFunc = this.renderer.listen('window', 'message', (event) => {
      switch (event.data) {
        case 'payment-success':
          this.onPaymentSuccess();
          break;
        case 'payment-cancel':
          this.onPaymentCancel();
          break;
        case 'payment-failure':
          this.onPaymentFailure();
          break;
        case 'payment-pending':
          this.onPaymentPending();
          break;
      }
    });
  }

  private checkout(): void {
    combineLatest(
      this.sandbox.getBalance$(),
      this.sandbox.getTotalPriceWithDiscount$(),
      this.sandbox.getFreshPriceWithDiscount$(),
    )
      .first()
      .subscribe(([balance, totalPriceWithDiscount, freshPriceWithDiscount]: [
        BalanceInterface,
        OfferingsTotalPriceInterface,
        OfferingsTotalPriceInterface | null]) => {

        if (freshPriceWithDiscount === null) {
          return this.router.navigateByUrl('/cart');
        }

        // if price is wrong - update price and return to cart
        if (freshPriceWithDiscount.customer_total_amount !== totalPriceWithDiscount.customer_total_amount
          || freshPriceWithDiscount.customer_discount_amount !== totalPriceWithDiscount.customer_discount_amount) {
          this.sandbox.setTotalPriceWithDiscount$(freshPriceWithDiscount);
          return this.router.navigateByUrl('/cart');
        }

        if (balance.customer_total >= totalPriceWithDiscount.customer_total_amount) {
          this.buyFromBalance();
        } else {
          this.identifyPaymentSystem();
        }
      });
  }

  private buyFromBalance(): void {
    // this.router.navigate(['/cashier/payment-failure-limited']);

    this.sandbox.getTransactionsCount$()
      .switchMap((count: number) => {
        this.sandbox.setCurrentDepositTransactionCount(count);
        return this.sandbox.buyFromBalance();
      })
      .subscribe((response) => {
        this.sandbox.setCurrentOrderObj(response.order);
        this.sandbox.trackOrderSuccess();
        this.sandbox.trackFirstPurchase();

        this.sandbox.loadBalance();
        this.sandbox.clearCart();
        this.router.navigateByUrl('/cashier/thank-you');
      });
  }

  identifyPaymentSystem() {
    this.sandbox.getCurrentPaymentSystem$()
      .first()
      .subscribe(currentPaymentSystem => {
          switch (currentPaymentSystem.mode) {
            case 's2s':
              combineLatest(
                this.sandbox.initS2SModeForDepositAndBuy(),
                this.sandbox.isPaymentLimited(),
              )
                .subscribe(([any, isPaymentLimited]) => {
                  if (isPaymentLimited) {
                    this.router.navigate(['/cashier/payment-failure-limited']);
                  } else {
                    this.isShowWiropaySystem = true;
                    this.sandbox.trackDepositPresent();
                  }
                });
              break;
            case 'iframe':
              combineLatest(
                this.sandbox.initIframeModeForDepositAndBuy(),
                this.sandbox.isPaymentLimited(),
              )
                .subscribe(([response, isPaymentLimited]) => {
                    if (isPaymentLimited) {
                      this.router.navigate(['/cashier/payment-failure-limited']);
                    } else {
                      this.isPaymentIframeUrl = true;
                      this.paymentIframeUrl = this.createIframeURL(response.payment_page_url);
                      this.sandbox.trackDepositPresent();
                    }
                  },
                  error => {
                    if (error.details.code === 'over_daily_limit') {
                      this.sandbox.showLightbox(error.details.property);
                    }
                  });
              break;
            case 'apcopay':
              this.isApcoPayIframeXML = true;
              combineLatest(
                this.sandbox.initIframeModeForDepositAndBuy(),
                this.sandbox.isPaymentLimited(),
              )
                .subscribe(([response, isPaymentLimited]) => {
                    if (isPaymentLimited) {
                      this.router.navigate(['/cashier/payment-failure-limited']);
                    } else {
                      if (document.getElementById('apco-iframe')) {
                        this.renderer.setProperty(document.getElementById('ap-spinner'), 'style', 'display: block');
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
                      this.renderer.setProperty(formInput, 'value', response.xml);
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
                      this.renderer.setProperty(apcoFrame, 'style', 'margin: 0 auto; border: none');
                      this.renderer.appendChild(document.getElementById('frame-container'), apcoFrame);

                      const xmlEl = document.getElementById('form-input');
                      xmlEl.click();
                      document.getElementById('apco-iframe').addEventListener('load', () => {
                        this.isIframeLoading = false;
                      });
                      // this.walletService.getApcoPayUrlFromXML(response.xml, (url) => {
                      //   this.paymentIframeUrl = this.createIframeURL(url);
                      //   this.sandbox.trackDepositPresent();
                      // });
                    }
                  },
                  error => {
                    if (error.details.code === 'over_daily_limit') {
                      this.sandbox.showLightbox(error.details.property);
                    }
                  });
              break;
          }
        },
        error => console.error('identify payment system', error)
      );
  }

  createIframeURL(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onPaymentSuccess() {
    this.sandbox.trackOrderSuccess();
    this.store.dispatch(new depositActions.DepositSuccess());
    this.sandbox.loadBalance();
    this.sandbox.clearCart();
    this.router.navigate(['/cashier/thank-you']);
  }

  onPaymentCancel() {
    this.paymentIframeUrl = null;
    this.router.navigate(['/cashier/payment-cancel']);
  }

  onPaymentFailure() {
    this.paymentIframeUrl = null;
    this.router.navigate(['/cashier/payment-failure']);
  }

  onPaymentPending() {
    this.paymentIframeUrl = null;
    this.router.navigate(['/cashier/payment-pending']);
  }

  ngOnDestroy(): void {
    this.unbindListenWindowMessageFunc();
  }
}
