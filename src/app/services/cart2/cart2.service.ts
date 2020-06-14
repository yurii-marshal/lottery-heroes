import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';

import * as fromRoot from '../../store/reducers/index';
import * as cartActions from '../../store/actions/cart.actions';

import {CartItemModel} from '../../models/cart/cart-item.model';
import {CurrencyService} from '../auth/currency.service';
import {BrandParamsService} from '../../modules/brand/services/brand-params.service';
import {OfferingsService} from '../offerings/offerings.service';
import {DrawsService} from '../lotteries/draws.service';
import {CartLotteryItemModel} from '../../models/cart/cart-lottery-item.model';
import {CartComboItemModel} from '../../models/cart/cart-combo-item.model';
import {CartItemPrice, CartItemPriceMap} from './entities/cart-item-price-map';
import {OfferingsPricesMapInterface} from '../api/entities/incoming/offerings/offerings-prices.interface';
import {OfferingsCombosMapInterface} from '../offerings/entities/offerings-combos-map.interface';
import {DrawsMapInterface} from '../lotteries/entities/interfaces/draws-map.interface';
import {LotteriesService} from '../lotteries/lotteries.service';
import {OfferingsApiService} from '../../modules/api/offerings.api.service';
import {ComboInterface} from '../../modules/api/entities/outgoing/common/combo.interface';
import {SubscriptionInterface} from '../../modules/api/entities/outgoing/common/subscription.interface';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {of} from 'rxjs/observable/of';
import {LineInterface} from '../../modules/api/entities/outgoing/common/line.interface';
import {OfferingsTotalPriceInterface} from '../../modules/api/entities/incoming/offerings/offerings-total-price.interface';
import {CartSyndicateItemModel} from '../../models/cart/cart-syndicate-item.model';
import {SyndicateInterface} from '../../modules/api/entities/outgoing/common/syndicate.interface';
import {map} from 'rxjs/operators';
import {BundleInterface} from '../../modules/api/entities/outgoing/common/bundle.interface';
import {CartBundleItemModel} from '../../models/cart/cart-bundle-item.model';
import {OfferingsBundlesMapInterface} from '../offerings/entities/offerings-bundles-map.interface';

@Injectable()
export class Cart2Service {
  protected items: Array<CartItemModel>;
  protected totalPriceSubject$: ReplaySubject<OfferingsTotalPriceInterface> = new ReplaySubject(1);

  constructor(protected store: Store<fromRoot.State>,
              protected currencyService: CurrencyService,
              protected offeringsApiService: OfferingsApiService,
              protected brandParamsService: BrandParamsService,
              protected offeringsService: OfferingsService,
              protected lotteriesService: LotteriesService,
              protected drawsService: DrawsService) {
    this.getItems$().subscribe((items: Array<CartItemModel>) => this.items = items);
    this.totalPriceUpdateInit();
  }

  getItems$(): Observable<CartItemModel[]> {
    return this.store.select(fromRoot.getCartItems);
  }

  getItem$(itemId: string): Observable<CartItemModel> {
    return this.getItems$().map(items => items.find(item => item.id === itemId));
  }

  getLinesAndItems$(): Observable<{
    lines: LineInterface[],
    combos: ComboInterface[],
    bundles: BundleInterface[],
    subscriptions: SubscriptionInterface[],
    syndicates: SyndicateInterface[]
  }> {

    return this.getItems$()
      .map((items: Array<CartItemModel>) => items.reduce((accumulator: {
        lines: Array<LineInterface>;
        combos: Array<ComboInterface>;
        bundles: Array<BundleInterface>;
        subscriptions: Array<SubscriptionInterface>;
        syndicates: Array<SyndicateInterface>
      }, currentValue: CartItemModel) => {
        switch (currentValue.type) {
          case 'lottery':
            if ((<CartLotteryItemModel>currentValue).renewPeriod === null) {
              accumulator.lines = accumulator.lines.concat((<CartLotteryItemModel>currentValue).lines);
            } else {
              accumulator.subscriptions = accumulator.subscriptions.concat([{
                renew_period: (<CartLotteryItemModel>currentValue).renewPeriod,
                lines: (<CartLotteryItemModel>currentValue).lines,
                // combos: [],
                // bundles: [],
              }]);
            }
            break;
          case 'combo':
            if ((<CartComboItemModel>currentValue).renewPeriod === null) {
              accumulator.combos = accumulator.combos.concat((<CartComboItemModel>currentValue).getComboObject());
            } else {
              accumulator.subscriptions = accumulator.subscriptions.concat([{
                renew_period: (<CartComboItemModel>currentValue).renewPeriod,
                lines: [],
                // combos: [(<CartComboItemModel>currentValue).getComboObject()],
              }]);
            }
            break;
          case 'bundle':
            if ((<CartBundleItemModel>currentValue).renewPeriod === null) {
              accumulator.bundles = accumulator.bundles.concat((<CartBundleItemModel>currentValue).getBundleObject());
            } else {
              accumulator.subscriptions = accumulator.subscriptions.concat([{
                renew_period: (<CartBundleItemModel>currentValue).renewPeriod,
                lines: [],
                // bundles: [(<CartBundleItemModel>currentValue).getBundleObject()],
              }]);
            }
            break;
          case 'syndicate':
            accumulator.syndicates = accumulator.syndicates.concat((<CartSyndicateItemModel>currentValue).getSyndicateObject());
            break;
        }

        return accumulator;
      }, {lines: [], combos: [], bundles: [], subscriptions: [], syndicates: []}));
  }

  getNumberOfItems$(): Observable<number> {
    return this.getItems$()
      .map((items: Array<CartItemModel>) => items.length);
  }

  getTotalPriceWithDiscount$(): Observable<OfferingsTotalPriceInterface> {
    return this.totalPriceSubject$.asObservable();
  }

  getFreshPriceWithDiscount(): Observable<OfferingsTotalPriceInterface | null> {
    return combineLatest(
      this.getLinesAndItems$(),
      this.currencyService.getCurrencyId(),
    )
      .switchMap(([linesAndItems, currencyId]: [
        {
          lines: LineInterface[],
          combos: ComboInterface[],
          bundles: BundleInterface[],
          subscriptions: SubscriptionInterface[],
          syndicates: SyndicateInterface[]
        },
        string]) => {
        return this.offeringsApiService.getTotalPrice(
          this.brandParamsService.getBrandId(),
          currencyId,
          linesAndItems.lines,
          linesAndItems.combos,
          linesAndItems.bundles,
          linesAndItems.subscriptions,
          linesAndItems.syndicates
        );
      })
      .catch(() => {
        this.offeringsService.updateOffers();
        this.lotteriesService.loadLotteriesMap();
        return of(null);
      });
  }

  setTotalPriceWithDiscount(freshPriceWithDiscount: OfferingsTotalPriceInterface): void {
    this.offeringsService.updateOffers();
    this.totalPriceSubject$.next(freshPriceWithDiscount);
  }

  getItemPriceMap$(): Observable<CartItemPriceMap> {
    return combineLatest(
      this.getItems$(),
      this.drawsService.getUpcomingDrawsMap(),
      this.offeringsService.getPrices(),
      this.offeringsService.getActiveCombosMap(),
      this.offeringsService.getActiveBundlesMap(),
      this.currencyService.getCurrencyId(),
    ).map(([items, upcomingDrawsMap, offeringsPrices, activeCombosMap, activeBundlesMap, currencyId]) => {
      const priceMap = {};

      items.forEach((item: CartItemModel) => {
        if (typeof item.getSerializedObject().renewPeriod !== 'undefined' &&
          item.getSerializedObject().renewPeriod !== null) {
          switch (item.type) {
            case 'lottery':
              priceMap[item.id] = this.offeringsApiService
                .getTotalPrice(
                  this.brandParamsService.getBrandId(),
                  currencyId,
                  [],
                  [],
                  [],
                  [{renew_period: (<CartLotteryItemModel>item).renewPeriod, lines: (<CartLotteryItemModel>item).lines}]
                )
                .map((value: OfferingsTotalPriceInterface) => {
                  return {
                    price: value.customer_original_amount,
                    discount: value.customer_discount_amount,
                    priceWithDiscount: value.customer_total_amount,
                  };
                });
              break;
            case 'combo':
              priceMap[item.id] = this.offeringsApiService
                .getTotalPrice(
                  this.brandParamsService.getBrandId(),
                  currencyId,
                  [],
                  [(<CartComboItemModel>item).getComboObject()],
                  // [{renew_period: item.renewPeriod, lines: [], combos: [(<CartComboItemModel>item).getComboObject()]}]
                )
                .map((value: OfferingsTotalPriceInterface) => {
                  return {
                    price: value.customer_original_amount,
                    discount: value.customer_discount_amount,
                    priceWithDiscount: value.customer_total_amount,
                  };
                });
              break;
            case 'bundle':
              priceMap[item.id] = this.offeringsApiService
                .getTotalPrice(
                  this.brandParamsService.getBrandId(),
                  currencyId,
                  [],
                  [],
                  [(<CartBundleItemModel>item).getBundleObject()],
                  // [{renew_period: item.renewPeriod, lines: [], bundles: [(<CartBundleItemModel>item).getBundleObject()]}]
                )
                .map((value: OfferingsTotalPriceInterface) => {
                  return {
                    price: value.customer_original_amount,
                    discount: value.customer_discount_amount,
                    priceWithDiscount: value.customer_total_amount,
                  };
                });
              break;
          }
        } else {
          switch (item.type) {
            case 'lottery':
              priceMap[item.id] = of(this.calcLotteryItemPrice(<CartLotteryItemModel>item, offeringsPrices, upcomingDrawsMap));
              break;
            case 'combo':
              priceMap[item.id] = of(this.calcComboItemPrice(<CartComboItemModel>item, activeCombosMap, currencyId));
              break;
            case 'bundle':
              priceMap[item.id] = of(this.calcBundleItemPrice(<CartBundleItemModel>item, activeBundlesMap, currencyId));
              break;
            case 'syndicate':
              priceMap[item.id] = this.calcSyndicateItemPrice(<CartSyndicateItemModel>item, currencyId);
              break;
            default:
              priceMap[item.id] = of({
                price: 0,
                discount: 0,
                priceWithDiscount: 0,
              });
          }
        }
      });

      return priceMap;
    });
  }

  private calcLotteryItemPrice(item: CartLotteryItemModel,
                               offeringsPrices: OfferingsPricesMapInterface,
                               upcomingDrawsMap: DrawsMapInterface): CartItemPrice {
    const upcomingDraw = upcomingDrawsMap[item.lotteryId];
    const upcomingDrawId = upcomingDraw ? upcomingDraw.id : null;

    const linePrice = OfferingsService.findLotteryLinePrice(offeringsPrices, item.lotteryId, upcomingDrawId);
    const price = item.lines.length * linePrice;
    const discount = item.lines.filter(line => line.isFree === true).length * linePrice;
    const priceWithDiscount = price - discount;
    return {price, discount, priceWithDiscount};
  }

  private calcComboItemPrice(item: CartComboItemModel,
                             activeCombosMap: OfferingsCombosMapInterface,
                             currencyId: string): CartItemPrice {
    let comboPrice = 0;
    let formerPrice = 0;
    const combo = activeCombosMap[item.comboId];
    if (typeof combo !== 'undefined') {
      combo.prices.forEach((pr) => {
        if (currencyId === pr.currency_id) {
          comboPrice = pr.price;
          formerPrice = pr.former_price;
        }
      });
    }
    const price = comboPrice;
    const discount = formerPrice - price;
    return {price: formerPrice, discount: discount, priceWithDiscount: price};
  }

  private calcBundleItemPrice(item: CartBundleItemModel,
                              activeBundlesMap: OfferingsBundlesMapInterface,
                              currencyId: string): CartItemPrice {
    let bundlePrice = 0;
    let formerPrice = 0;
    const bundle = activeBundlesMap[item.bundleId];
    if (typeof bundle !== 'undefined') {
      bundle.prices.forEach((pr) => {
        if (currencyId === pr.currency_id) {
          bundlePrice = pr.price;
          formerPrice = pr.former_price;
        }
      });
    }
    const price = bundlePrice;
    const discount = formerPrice - price;
    return {price: formerPrice, discount: discount, priceWithDiscount: price};
  }

  private calcSyndicateItemPrice(item: CartSyndicateItemModel, currencyId: string): Observable<CartItemPrice> {
    return this.offeringsApiService
      .getTotalPrice(
        this.brandParamsService.getBrandId(),
        currencyId,
        [],
        [],
        [],
        [item.getSyndicateObject()]
      )
      .pipe(
        map((value: OfferingsTotalPriceInterface) => {
          return {
            price: value.customer_original_amount,
            discount: value.customer_discount_amount,
            priceWithDiscount: value.customer_total_amount,
          };
        })
      );
  }

  private totalPriceUpdateInit(): void {
    combineLatest(
      this.getLinesAndItems$(),
      this.currencyService.getCurrencyId(),
    )
      .debounceTime(500)
      .distinctUntilChanged((a, b) => {
        const linesAndItems_A = a[0];
        const currencyId_A = a[1];

        const linesAndItems_B = b[0];
        const currencyId_B = b[1];

        if (currencyId_A !== currencyId_B) {
          return false;
        }

        if (this.hashLines(linesAndItems_A.lines) !== this.hashLines(linesAndItems_B.lines)) {
          return false;
        }

        if (this.hashCombos(linesAndItems_A.combos) !== this.hashCombos(linesAndItems_B.combos)) {
          return false;
        }

        if (this.hashBundles(linesAndItems_A.bundles) !== this.hashBundles(linesAndItems_B.bundles)) {
          return false;
        }

        if (this.hashSubscriptions(linesAndItems_A.subscriptions) !== this.hashSubscriptions(linesAndItems_B.subscriptions)) {
          return false;
        }

        if (this.hashSyndicates(linesAndItems_A.syndicates) !== this.hashSyndicates(linesAndItems_B.syndicates)) {
          return false;
        }

        return true;
      })
      .switchMap(data => {
        const linesAndItems = data[0];
        const currencyId = data[1];

        if (linesAndItems.lines.length > 0 ||
          linesAndItems.combos.length > 0 ||
          linesAndItems.bundles.length > 0 ||
          linesAndItems.subscriptions.length > 0 ||
          linesAndItems.syndicates.length > 0) {
          return this.offeringsApiService.getTotalPrice(
            this.brandParamsService.getBrandId(),
            currencyId,
            linesAndItems.lines,
            linesAndItems.combos,
            linesAndItems.bundles,
            linesAndItems.subscriptions,
            linesAndItems.syndicates
          );
        } else {
          return of({
            customer_total_amount: 0,
            customer_discount_amount: 0,
          });
        }
      })
      .subscribe((totalPrice: OfferingsTotalPriceInterface) => {
        this.totalPriceSubject$.next(totalPrice);
      }, () => {
        this.lotteriesService.loadLotteriesMap();
        this.offeringsService.updateOffers();
      });
  }

  private hashLines(lines: Array<LineInterface>): string {
    const lotteriesMap = this.convertLinesListToCountMap(lines);
    let result = '';
    Object.keys(lotteriesMap).forEach((lotteryId) => {
      result = result + lotteryId + lotteriesMap[lotteryId].toString();
    });
    return result;
  }

  private hashCombos(combos: Array<ComboInterface>): string {
    let result = '';
    combos.forEach((combo) => {
      result = result + combo.id;
    });
    return result;
  }

  private hashBundles(bundles: Array<BundleInterface>): string {
    let result = '';
    bundles.forEach((bundle) => {
      result = result + bundle.id;
    });
    return result;
  }

  private hashSubscriptions(subscriptions: Array<SubscriptionInterface>): string {
    let result = '';
    subscriptions.forEach(sub => {
      result += sub.renew_period + this.hashLines(sub.lines);
    });
    return result;
  }

  private hashSyndicates(syndicates: Array<SyndicateInterface>): string {
    let result = '';
    syndicates.forEach(syndicate => {
      result += syndicate.num_shares;
    });
    return result;
  }

  private convertLinesListToCountMap(linesList: Array<LineInterface>): { [lotteryId: string]: number } {
    return linesList.reduce((resultMap, line) => {
      return Object.assign(resultMap, {
        [line.lottery_id]: (!!resultMap[line.lottery_id] ? resultMap[line.lottery_id] + line.draws : line.draws)
      });
    }, {});
  }

  setItems(items: Array<CartItemModel>): void {
    if (JSON.stringify(items) !== JSON.stringify(this.items)) {
      this.store.dispatch(new cartActions.SetCartItems(items));
    }
  }

  addItems(items: Array<CartItemModel>): void {
    this.store.dispatch(new cartActions.SetCartItems([...this.items, ...items]));
  }

  deleteItems(itemIds: Array<string>): void {
    this.store.dispatch(new cartActions.SetCartItems(this.items
      .filter((item: CartItemModel) => itemIds.indexOf(item.id) === -1)));
  }

  clear(): void {
    this.setItems([]);
  }
}
