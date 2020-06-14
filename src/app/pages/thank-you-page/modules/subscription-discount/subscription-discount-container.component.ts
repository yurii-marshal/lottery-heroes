import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { OfferingsApiService } from '../../../../modules/api/offerings.api.service';
import { BrandParamsService } from '../../../../modules/brand/services/brand-params.service';
import { CurrencyService } from '../../../../services/auth/currency.service';
import {
  OfferingsTotalPriceInterface
} from '../../../../modules/api/entities/incoming/offerings/offerings-total-price.interface';
import { LotteriesMapInterface } from '../../../../services/lotteries/entities/interfaces/lotteries-map.interface';
import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../store/reducers/index';
import * as walletActions from '../../../../store/actions/wallet.actions';
import { Cart2LotteryService } from '../../../../services/cart2/cart2-lottery.service';
import { CartLotteryItemModel } from '../../../../models/cart/cart-lottery-item.model';
import { Router } from '@angular/router';
import { Cart2Service } from '../../../../services/cart2/cart2.service';
import { combineLatest } from 'rxjs/observable/combineLatest';
import * as subscriptionDiscountActions from './actions/subscription-discount.actions';
import { LineInterface } from '../../../../modules/api/entities/outgoing/common/line.interface';

@Component({
  selector: 'app-subscription-discount-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-subscription-discount
      *ngIf="isShown$|async"
      [lotteriesMap]="lotteriesMap$|async"
      [currencyId]="currencyId$|async"
      [lastOrderSubscriptionsPriceMap]="lastOrderSubscriptionsPriceMap$|async"
      (addSubscriptionsToCartEvent)="onAddSubscriptionsToCartEvent()"
    ></app-subscription-discount>
  `
})
export class SubscriptionDiscountContainerComponent {
  lotteriesMap$: Observable<LotteriesMapInterface>;
  currencyId$: Observable<string>;
  isShown$: Observable<boolean>;
  private lastOrderLinesMap$: Observable<{[lotteryId: string]: Array<LineInterface>}>;
  lastOrderSubscriptionsPriceMap$: Observable<{[lotteryId: string]: {price: number, discount: number}}>;

  private readonly period = 'P1M';

  constructor(private store: Store<fromRoot.State>,
              private lotteriesService: LotteriesService,
              private offeringsApiService: OfferingsApiService,
              private brandParamsService: BrandParamsService,
              private currencyService: CurrencyService,
              private cart2Service: Cart2Service,
              private cart2LotteryService: Cart2LotteryService,
              private router: Router) {
    this.lotteriesMap$ = this.lotteriesService.getLotteriesMap();
    this.currencyId$ = this.currencyService.getCurrencyId();

    const lastOrderLines$ = this.store.select(fromRoot.getCartLastOrdered)
      .filter(order => order !== null)
      .map(order => order.lines);

    this.isShown$ = lastOrderLines$
      .map((lines: Array<LineInterface>) => lines.length > 0);

    this.lastOrderLinesMap$ = lastOrderLines$
      .map((lines: Array<LineInterface>) => {
        return lines.reduce((resultMap, line: LineInterface) => {
          if (typeof resultMap[line.lottery_id] === 'undefined') {
            resultMap[line.lottery_id] = [];
          }
          resultMap[line.lottery_id].push(line);
          return resultMap;
        }, {});
      });

    this.lastOrderSubscriptionsPriceMap$ = combineLatest(
      this.lastOrderLinesMap$,
      this.currencyService.getCurrencyId()
    )
      .switchMap(([linesMap, currencyId]) => {
        const subscriptions = Object.keys(linesMap)
          .reduce((result, lotteryId) => {
            result.push({
              renew_period: this.period,
              lines: linesMap[lotteryId],
            });

            return result;
          }, []);

        return this.offeringsApiService.getTotalPrice(
          this.brandParamsService.getBrandId(),
          currencyId,
          [],
          [],
          subscriptions
        );
      })
      .map((prices: OfferingsTotalPriceInterface) => {
        return prices.subscriptions.reduce((resultMap, subscription: any) => {
          resultMap[subscription.lines[0].lottery_id] = {
            price: subscription.customer_amount,
            discount: subscription.customer_discount_amount,
          };
          return resultMap;
        }, {});
      });
  }

  onAddSubscriptionsToCartEvent() {
    this.lastOrderLinesMap$
      .first()
      .subscribe((linesMap) => {
        this.store.dispatch(new walletActions.SetSkipFirstDrawParam('true'));

        const items = Object.keys(linesMap)
          .reduce((result, lotteryId) => {
            result.push(new CartLotteryItemModel(lotteryId, linesMap[lotteryId], this.period));
            return result;
          }, []);

        this.cart2Service.clear();
        this.cart2LotteryService.addItems(items);
        this.store.dispatch(new subscriptionDiscountActions.AddSubscriptionToCart({ url: this.router.url }));
        this.router.navigateByUrl('/cart');
      });
  }
}
