import {Inject, Injectable, NgZone, PLATFORM_ID} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {isPlatformBrowser} from '@angular/common';
import {Store} from '@ngrx/store';

import * as fromRoot from '../store/reducers/index';
import * as cartActions from '../store/actions/cart.actions';

import {WalletApiService} from './api/wallet.api.service';
import {ConfigService} from '../modules/ex-core/services/config.service';
import {CustomerService} from './auth/customer.service';
import {SessionsService} from './auth/sessions.service';

import {BalanceInterface} from './api/entities/incoming/wallet/balance.interface';
import {CustomerInterface} from './auth/entities/interfaces/customer.interface';
import {OrderInterface} from './api/entities/incoming/wallet/order.interface';
import {PaymentSystemInterface} from './api/entities/incoming/wallet/payment-system.interface';
import {CustomerCardInterface} from './api/entities/incoming/wallet/customer-card.interface';
import {DepositAndBuyInterface} from './api/entities/incoming/wallet/deposit-and-buy.interface';
import {BrandParamsService} from '../modules/brand/services/brand-params.service';
import {DepositLimitInterface} from './api/entities/incoming/wallet/deposit-limit.interface';
import {ComboInterface} from '../modules/api/entities/outgoing/common/combo.interface';
import {SubscriptionInterface} from '../modules/api/entities/outgoing/common/subscription.interface';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {interval} from 'rxjs/observable/interval';
import {LineInterface} from '../modules/api/entities/outgoing/common/line.interface';
import {SyndicateInterface} from '../modules/api/entities/outgoing/common/syndicate.interface';
import {BundleInterface} from '../modules/api/entities/outgoing/common/bundle.interface';
import {OfferingsBundleInterface, OfferingsBundlesInterface} from '../modules/api/entities/incoming/offerings/offerings-bundles.interface';

interface GetTransactionsParamsInterface {
  typeId?: string;
  statusorderId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

interface GetTransactionsCountInterface {
  typeId?: number;
  status?: string;
  orderId?: number;
  startDate?: Date;
  endDate?: Date;
}

@Injectable()
export class WalletService {
  private customer: CustomerInterface;
  private balanceSubject$: BehaviorSubject<BalanceInterface>;
  private balance$: Observable<BalanceInterface>;

  private customerCardsSubject$: BehaviorSubject<CustomerCardInterface[]>;
  private customerCards$: Observable<CustomerCardInterface[]>;

  private depositAmountSubject$: BehaviorSubject<number>;
  private depositAmount$: Observable<number>;

  private depositAndBuyObjSubject$: BehaviorSubject<DepositAndBuyInterface>;
  private depositAndBuyObj$: Observable<DepositAndBuyInterface>;

  private currentDepositTransactionCount: number;
  private currentPurchaseTransactionCount: number;
  private numberSecondsReloadBalance: number;
  private currentOrderObj: OrderInterface;
  private transactionInProgress = false;
  private minimumDeposit: number;

  constructor(private store: Store<fromRoot.State>,
              private walletApiService: WalletApiService,
              private configService: ConfigService,
              private customerService: CustomerService,
              @Inject(PLATFORM_ID) private platformId: Object,
              private sessionService: SessionsService,
              private zone: NgZone,
              private httpClient: HttpClient,
              private brandParamsService: BrandParamsService) {
    this.balanceSubject$ = new BehaviorSubject(null);
    this.balance$ = this.balanceSubject$.asObservable();

    this.customerCardsSubject$ = new BehaviorSubject(null);
    this.customerCards$ = this.customerCardsSubject$.asObservable();

    this.depositAmountSubject$ = new BehaviorSubject(null);
    this.depositAmount$ = this.depositAmountSubject$.asObservable();

    this.depositAndBuyObjSubject$ = new BehaviorSubject(null);
    this.depositAndBuyObj$ = this.depositAndBuyObjSubject$.asObservable();

    this.customerService.getCustomer().subscribe((customer: CustomerInterface) => {
      this.customer = customer;
      if (customer === null) {
        if (this.balanceSubject$.getValue() !== null) {
          this.balanceSubject$.next(null);
        }
      } else {
        this.loadBalance();
      }
    });

    this.numberSecondsReloadBalance = this.configService.getConfig('common', 'numberSecondsReloadBalance');
    this.brandParamsService.getConfig('minimumDeposit').subscribe(minDeposit => this.minimumDeposit = minDeposit);

    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        interval(this.numberSecondsReloadBalance * 1000).subscribe(() => {
          this.zone.run(() => {
            this.loadBalance();
          });
        });
      });
    }
  }

  deposit(depositObj) {
    if (this.transactionInProgress === true) {
      return;
    }
    this.transactionInProgress = true;

    return this.walletApiService.deposit(depositObj)
      .map((res) => {
        this.removeTransactionFlag();
        return res;
      })
      .catch((res) => {
        this.removeTransactionFlag();
        return ErrorObservable.create(res);
      });
  }

  buy(totalAmount: number,
      discountAmount: number,
      lines: Array<LineInterface>,
      combos: Array<ComboInterface> = [],
      bundles: Array<BundleInterface> = [],
      subscriptions: Array<SubscriptionInterface> = [],
      syndicates: Array<SyndicateInterface> = [],
      skipFirstDraw: string | null = null): Observable<any> {
    if (this.transactionInProgress === true) {
      return;
    }
    this.transactionInProgress = true;

    const buyObj: any = {
      total_amount: totalAmount,
      discount_amount: discountAmount,
      lines,
      combos,
      bundles,
      subscriptions,
      shares: syndicates
    };

    if (skipFirstDraw !== null) {
      buyObj.skip = skipFirstDraw;
    }

    return this.walletApiService.buy(buyObj)
      .do(() => this.store.dispatch(new cartActions.SetLastOrdered({lines, combos, bundles, subscriptions, shares: syndicates})))
      .map((res) => {
        this.removeTransactionFlag();
        return res;
      })
      .catch((res) => {
        this.removeTransactionFlag();
        return ErrorObservable.create(res);
      });
  }

  depositAndBuy(depositAndBuyObj, skipFirstDraw: string | null = null): Observable<any> {
    if (this.transactionInProgress === true) {
      return;
    }
    this.transactionInProgress = true;

    if (skipFirstDraw !== null) {
      depositAndBuyObj.skip = skipFirstDraw;
    }

    return this.walletApiService.depositAndBuy(depositAndBuyObj)
      .do(() => this.store.dispatch(new cartActions.SetLastOrdered({
        'lines': depositAndBuyObj.lines,
        'combos': depositAndBuyObj.combos,
        'bundles': depositAndBuyObj.bundles,
        'subscriptions': depositAndBuyObj.subscriptions,
        'shares': depositAndBuyObj.shares
      })))
      .map((res) => {
        this.removeTransactionFlag();
        return res;
      })
      .catch((res) => {
        this.removeTransactionFlag();
        return ErrorObservable.create(res);
      });
  }

  removeTransactionFlag() {
    this.transactionInProgress = false;
  }

  getCustomerTransactions(params: GetTransactionsParamsInterface = {}): Observable<any[]> {
    let httpParams = new HttpParams();

    if (params.typeId) {
      httpParams = httpParams.set('type_id', params.typeId);
    }
    if (params.statusorderId) {
      httpParams = httpParams.set('statusorder_id', params.statusorderId);
    }

    if (params.startDate) {
      httpParams = httpParams.set('start_date', params.startDate.toISOString());
    }

    if (params.endDate) {
      httpParams = httpParams.set('end_date', params.endDate.toISOString());
    }

    if (params.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }

    return this.walletApiService.getCustomerTransactions(httpParams);
  }

  getLastOrder(): Observable<any | null> {
    return this.walletApiService.getOrders(1, 'confirmed')
      .map(orders => orders.length > 0 ? orders[0] : null);
  }

  getCustomerBalance(): Observable<BalanceInterface> {
    return this.balance$;
  }

  requestCustomerBalance(): Observable<BalanceInterface> {
    return this.walletApiService.getCustomerBalance()
      .do((balance: BalanceInterface) => {
        this.balanceSubject$.next(balance);
      });
  }

  loadBalance(): void {
    if (this.sessionService.isSessionExist() === true) {
      this.walletApiService.getCustomerBalance()
        .subscribe((balance: BalanceInterface) => {
          this.balanceSubject$.next(balance);
        });
    }
  }

  loadBalanceUntilChange(time: number): void {
    let timer;

    if (this.sessionService.isSessionExist() === true) {
      this.zone.runOutsideAngular(() => {
        timer = setInterval(() => {
          this.zone.run(() => {
            const currentBalance = this.balanceSubject$.getValue();
            this.walletApiService.getCustomerBalance()
              .subscribe((balance: BalanceInterface) => {
                this.balanceSubject$.next(balance);
                if (balance.customer_total !== currentBalance.customer_total) {
                  clearInterval(timer);
                }
              });
          });
        }, time);
      });

      this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          this.zone.run(() => {
            clearInterval(timer);
          });
        }, this.numberSecondsReloadBalance * 1000);
      });
    }
  }

  customerWithdraw(amount: number, note: string) {
    return this.walletApiService.customerWithdraw({amount: amount, note: note});
  }

  getCustomerDepositLimits(): Observable<DepositLimitInterface | undefined> {
    return this.walletApiService.getCustomerDepositLimits();
  }

  customerDepositeLimitsUpdate(amount: number, type: string) {
    return this.walletApiService.customerDepositeLimitsUpdate({amount: amount, type: type});
  }

  getTransactionsCount(params: GetTransactionsCountInterface = {}): Observable<{ count: number }> {
    let httpParams = new HttpParams();

    if (params.typeId) {
      httpParams = httpParams.set('type_id', params.typeId.toString());
    }
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }

    if (params.orderId) {
      httpParams = httpParams.set('order_id', params.orderId.toString());
    }

    if (params.startDate) {
      httpParams = httpParams.set('start_date', params.startDate.toISOString());
    }

    if (params.endDate) {
      httpParams = httpParams.set('end_date', params.endDate.toISOString());
    }

    return this.walletApiService.getTransactionsCount(httpParams);
  }

  setCurrentDepositAmount(amount: number) {
    const amountDeposit = this.recountMinimumDeposit(amount);
    this.depositAmountSubject$.next(amountDeposit);
  }

  getCurrentDepositAmount() {
    return this.depositAmount$;
  }

  setCurrentDepositTransactionCount(count: number) {
    this.currentDepositTransactionCount = count;
  }

  getCurrentDepositTransactionCount() {
    return this.currentDepositTransactionCount;
  }

  setCurrentPurchaseTransactionCount(count: number) {
    this.currentPurchaseTransactionCount = count;
  }

  getCurrentPurchaseTransactionCount() {
    return this.currentPurchaseTransactionCount;
  }

  setCurrentOrderObj(order: OrderInterface) {
    this.currentOrderObj = order;
  }

  getCurrentOrderObj() {
    return this.currentOrderObj;
  }

  getCurrentPaymentSystem(): Observable<PaymentSystemInterface> {
    return this.brandParamsService.getPaymentSystemData();
  }

  getCustomerCards(): Observable<CustomerCardInterface[]> {
    return this.customerCards$;
  }

  setCustomerCards(customerCards) {
    this.customerCardsSubject$.next(customerCards);
  }

  getApcoPayUrlFromXML(xml, callback) {
    this.getApcoUrl(xml).subscribe((data) => {
        console.log(data);
        callback(data);
      },
      (error) => {
        console.log(error);
      });
  }

  getApcoUrl(xml: string): Observable<any> {
    return this.postApcoXML(xml)
      .map((result) => result);
  }

  postApcoXML(xml) {
    console.log(xml);
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Access-Control-Allow-Origin', '*')
        .set('Cache-Control', 'no-cache')
        .set('withCredentials', 'true')
    };
    const body = new URLSearchParams()
      .set('params', xml);

    return this.httpClient.post('https://www.apsp.biz/pay/FP5a/Checkout.aspx', body, options)
      .catch(error => ErrorObservable.create(error.error));
  }

  loadCustomerCards(): void {
    if (this.sessionService.isSessionExist() === true) {
      let httpParams = new HttpParams();
      httpParams = httpParams.set('cid', this.customer.cid);

      this.walletApiService.getCustomerCards(httpParams)
        .subscribe((customerCards: CustomerCardInterface[]) => {
          this.setCustomerCards(customerCards);
        });
    }
  }

  setDepositAndBuyObj(depositAndBuyObj: DepositAndBuyInterface) {
    depositAndBuyObj.deposit_amount = this.recountMinimumDeposit(depositAndBuyObj.deposit_amount);
    this.depositAndBuyObjSubject$.next(depositAndBuyObj);
  }

  getDepositAndBuyObj() {
    return this.depositAndBuyObj$;
  }

  recountMinimumDeposit(amount: number) {
    return (amount >= this.minimumDeposit) ? amount : this.minimumDeposit;
  }

  getCustomerSubscriptions(): Observable<any> {
    return this.walletApiService.getCustomerSubscriptions();
  }

  getCustomerSubscriptionById(id: number): Observable<any> {
    return this.walletApiService.getCustomerSubscriptionById(id);
  }

  cancelCustomerSubscriptionById(id: number): Observable<any> {
    return this.walletApiService.cancelCustomerSubscriptionById(id);
  }
}
