import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MetaService } from '../../modules/meta/services/meta.service';
import { WalletService } from '../../services/wallet.service';
import { Cart2Service } from '../../services/cart2/cart2.service';
import { AuthService } from '../../services/auth/auth.service';
import { LotteriesService } from '../../services/lotteries/lotteries.service';
import { DrawsService } from '../../services/lotteries/draws.service';
import { BrandParamsService } from '../../modules/brand/services/brand-params.service';
import { GlobalService } from '../../services/global.service';
import { AnalyticsDeprecatedService } from '../../modules/analytics-deprecated/services/analytics-deprecated.service';

import { environment } from '../../../environments/environment';
import { NumbersUtil } from '../../modules/shared/utils/numbers.util';
import { BalanceInterface } from '../../services/api/entities/incoming/wallet/balance.interface';
import { PaymentSystemInterface } from '../../services/api/entities/incoming/wallet/payment-system.interface';
import { OrderInterface } from '../../services/api/entities/incoming/wallet/order.interface';
import { OfferingsTotalPriceInterface } from '../../modules/api/entities/incoming/offerings/offerings-total-price.interface';

import * as fromRoot from '../../store/reducers/index';
import * as walletActions from '../../store/actions/wallet.actions';
import { Store } from '@ngrx/store';
import { ComboInterface } from '../../modules/api/entities/outgoing/common/combo.interface';
import { SubscriptionInterface } from '../../modules/api/entities/outgoing/common/subscription.interface';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { LineInterface } from '../../modules/api/entities/outgoing/common/line.interface';
import { SyndicateInterface } from '../../modules/api/entities/outgoing/common/syndicate.interface';
import { of } from 'rxjs/observable/of';
import {BundleInterface} from '../../modules/api/entities/outgoing/common/bundle.interface';

@Injectable()
export class CashierPageSandbox {
  constructor(private metaService: MetaService,
              private walletService: WalletService,
              private cart2Service: Cart2Service,
              private authService: AuthService,
              private lotteriesService: LotteriesService,
              private drawsService: DrawsService,
              private brandParamsService: BrandParamsService,
              private globalService: GlobalService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private store: Store<fromRoot.State>) {
  }

  getBalance$(): Observable<BalanceInterface> {
    return this.walletService.requestCustomerBalance();
  }

  loadBalance(): void {
    this.walletService.loadBalance();
  }

  getTotalPriceWithDiscount$(): Observable<OfferingsTotalPriceInterface> {
    return this.cart2Service.getTotalPriceWithDiscount$();
  }

  getFreshPriceWithDiscount$(): Observable<OfferingsTotalPriceInterface> {
    return this.cart2Service.getFreshPriceWithDiscount();
  }

  setTotalPriceWithDiscount$(freshPriceWithDiscount: OfferingsTotalPriceInterface): void {
    this.cart2Service.setTotalPriceWithDiscount(freshPriceWithDiscount);
  }

  buyFromBalance(): Observable<any> {
    return combineLatest(
      this.cart2Service.getTotalPriceWithDiscount$(),
      this.cart2Service.getLinesAndItems$(),
      this.store.select(fromRoot.getSkipFirstDrawParam),
    )
      .first()
      .switchMap(([priceWithDiscount, linesAndItems, skipFirstDrawParam]: [OfferingsTotalPriceInterface, {
        lines: LineInterface[];
        combos: ComboInterface[];
        bundles: BundleInterface[];
        subscriptions: SubscriptionInterface[];
        syndicates: SyndicateInterface[];
      }, string | null]) => {
        this.store.dispatch(new walletActions.SetSkipFirstDrawParam(null));

        return this.walletService.buy(
          priceWithDiscount.customer_total_amount,
          priceWithDiscount.customer_discount_amount,
          linesAndItems.lines,
          linesAndItems.combos,
          linesAndItems.bundles,
          linesAndItems.subscriptions,
          linesAndItems.syndicates,
          skipFirstDrawParam
        );
      });
  }

  getTransactionsCount$(): Observable<any> {
    const transactionTypeDeposit = 1;
    const transactionTypePurchase = 3;
    const transactionStatus = 'approved';

    return forkJoin(
      this.walletService.getTransactionsCount({typeId: transactionTypeDeposit, status: transactionStatus}),
      this.walletService.getTransactionsCount({typeId: transactionTypePurchase, status: transactionStatus}),
    )
      .map(data => {
        this.walletService.setCurrentDepositTransactionCount(data[0].count);
        this.walletService.setCurrentPurchaseTransactionCount(data[1].count);
      });
  }

  clearCart(): void {
    this.cart2Service.clear();
  }

  setMeta(): void {
    this.metaService.setFromConfig('page', 'cashier');
  }

  setCurrentDepositTransactionCount(count: number): void {
    this.walletService.setCurrentDepositTransactionCount(count);
  }

  setCurrentOrderObj(order): void {
    this.walletService.setCurrentOrderObj(order);
  }

  getCurrentPaymentSystem$(): Observable<PaymentSystemInterface> {
    return this.walletService.getCurrentPaymentSystem();
  }

  showLightbox(name: string): void {
    this.globalService.showLightbox$.emit({name: name, value: ''});
  }

  initS2SModeForDepositAndBuy(): Observable<any> {
    this.walletService.loadCustomerCards();

    return combineLatest(
      this.cart2Service.getLinesAndItems$(),
      this.getBalance$(),
      this.getTotalPriceWithDiscount$(),
      this.getTransactionsCount$(),
    )
      .first()
      .do(([linesAndItems,
             balance,
             totalPriceWithDiscount,
             transactionsCount]: [
        {
          lines: LineInterface[],
          combos: ComboInterface[],
          bundles: BundleInterface[],
          subscriptions: SubscriptionInterface[],
          syndicates: SyndicateInterface[]
        },
        BalanceInterface,
        OfferingsTotalPriceInterface,
        number]) => {
        const depositAmount = NumbersUtil.roundPrice(totalPriceWithDiscount.customer_total_amount - balance.customer_total);

        this.walletService.setCurrentDepositTransactionCount(transactionsCount);
        this.walletService.setCurrentDepositAmount(depositAmount);
        this.walletService.setDepositAndBuyObj({
          total_amount: totalPriceWithDiscount.customer_total_amount,
          discount_amount: totalPriceWithDiscount.customer_discount_amount,
          deposit_amount: depositAmount,
          lines: linesAndItems.lines,
          combos: linesAndItems.combos,
          bundles: linesAndItems.bundles,
          subscriptions: linesAndItems.subscriptions,
          shares: linesAndItems.syndicates
        });
      });
  }

  initIframeModeForDepositAndBuy(): Observable<any> {
    return combineLatest(
      this.cart2Service.getLinesAndItems$(),
      this.getBalance$(),
      this.getTotalPriceWithDiscount$(),
      this.getTransactionsCount$(),
      this.store.select(fromRoot.getSkipFirstDrawParam),
    )
      .first()
      .switchMap(([linesAndItems,
                    balance,
                    totalPriceWithDiscount,
                    transactionsCount,
                    skipFirstDrawParam]: [
        {
          lines: LineInterface[],
          combos: ComboInterface[],
          bundles: BundleInterface[],
          subscriptions: SubscriptionInterface[],
          syndicates: SyndicateInterface[]
        },
        BalanceInterface,
        OfferingsTotalPriceInterface,
        number,
        string | null]) => {
        const depositAmount = NumbersUtil.roundPrice(totalPriceWithDiscount.customer_total_amount - balance.customer_total);

        this.walletService.setCurrentDepositTransactionCount(transactionsCount);
        this.walletService.setCurrentDepositAmount(depositAmount);
        const sendObj = {
          total_amount: totalPriceWithDiscount.customer_total_amount,
          discount_amount: totalPriceWithDiscount.customer_discount_amount,
          deposit_amount: depositAmount,
          lines: linesAndItems.lines,
          combos: linesAndItems.combos,
          bundles: linesAndItems.bundles,
          subscriptions: linesAndItems.subscriptions,
          shares: linesAndItems.syndicates
        };

        this.store.dispatch(new walletActions.SetSkipFirstDrawParam(null));

        return this.walletService.depositAndBuy(sendObj, skipFirstDrawParam);
      })
      .do((response: {order: OrderInterface, payment_page_url: string}) => this.walletService.setCurrentOrderObj(response.order));
  }

  isPaymentLimited(): Observable<boolean> {
    // return of(true);
    return this.brandParamsService.getConfig('brandPaymentLimited')
      .map((brandPaymentLimited: boolean) => {
        return !(!brandPaymentLimited || (!environment.paymentLimited && this.globalService.cashier));
      });
  }

  trackOrderSuccess() {
    this.authService.loadCustomerStats();

    combineLatest(
      this.lotteriesService.getLotteriesMap().filter(lotteries => !!lotteries),
      this.drawsService.getUpcomingDrawsMap().filter(draws => !!draws),
      this.cart2Service.getItems$()
    )
      .first()
      .subscribe(data => {
        this.analyticsDeprecatedService.trackOrderSuccess({
          lotteriesMap: data[0],
          upcomingDrawsMap: data[1],
          cartItems: data[2]
        });
      });
  }

  trackDepositPresent(): void {
    combineLatest(
      this.lotteriesService.getLotteriesMap().filter(lotteries => !!lotteries),
      this.drawsService.getUpcomingDrawsMap().filter(draws => !!draws),
      this.cart2Service.getItems$(),
    )
      .first()
      .subscribe(data => {
        this.analyticsDeprecatedService.trackDepositFormPresented('checkout', {
          lotteriesMap: data[0],
          upcomingDrawsMap: data[1],
          cartItems: data[2]
        });
      });
  }

  trackFirstPurchase() {
    this.analyticsDeprecatedService.trackFirstPurchase('Balance');
  }

}
