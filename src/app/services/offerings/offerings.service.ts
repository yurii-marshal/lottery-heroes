import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {BrandParamsService} from '../../modules/brand/services/brand-params.service';

import {OfferingsPricesMapInterface, PriceInterface} from '../api/entities/incoming/offerings/offerings-prices.interface';
import {ArraysUtil} from '../../modules/shared/utils/arrays.util';

import {OfferingsComboInterface} from '../../modules/api/entities/incoming/offerings/offerings-combos.interface';
import {OfferingsCombosMapInterface} from './entities/offerings-combos-map.interface';

import {
  OfferingsSubscriptionDiscountInterface
} from '../../modules/api/entities/incoming/offerings/offerings-subscription-discounts.interface';
import {OfferingsApiService} from '../../modules/api/offerings.api.service';
import {
  OfferFreeLinesInterface,
  OfferingsFreeLinesOffersMapInterface,
  OfferingsOffersMapInterface,
  OfferInterface
} from '../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import {OfferingsBundleInterface} from '../../modules/api/entities/incoming/offerings/offerings-bundles.interface';
import {OfferingsBundlesMapInterface} from './entities/offerings-bundles-map.interface';

@Injectable()
export class OfferingsService {
  private brandId: string;
  private pricesSubject$: BehaviorSubject<OfferingsPricesMapInterface | null>;
  private offersSubject$: BehaviorSubject<OfferingsOffersMapInterface | null>;
  private activeCombosSubject$: BehaviorSubject<OfferingsComboInterface[] | null>;
  private activeBundlesSubject$: BehaviorSubject<OfferingsBundleInterface[] | null>;
  private subscriptionDiscountsSubject$: BehaviorSubject<OfferingsSubscriptionDiscountInterface[] | null>;

  static findLotteryLinePrice(offeringsPrices: OfferingsPricesMapInterface,
                              lotteryId: string,
                              drawId: number | null): number | null {
    if (!offeringsPrices) {
      return null;
    }

    const lotteryOfferingsPrices = offeringsPrices[lotteryId];

    if (!lotteryOfferingsPrices) {
      return null;
    }

    const lotteryPrices: Array<PriceInterface> = lotteryOfferingsPrices.prices;
    const lotteryPrice: PriceInterface = ArraysUtil.findObjByKeyValue(lotteryPrices, 'draw_id', drawId)
      || ArraysUtil.findObjByKeyValue(lotteryPrices, 'draw_id', null);

    return lotteryPrice ? lotteryPrice.base_line_price : null;
  }

  private static convertCombosListToMap(list: Array<OfferingsComboInterface>): OfferingsCombosMapInterface {
    return list.reduce((resultMap: OfferingsCombosMapInterface, combo: OfferingsComboInterface) => {
      return Object.assign(resultMap, {
        [combo.id]: combo
      });
    }, {});
  }

  private static convertBundlesListToMap(list: Array<OfferingsBundleInterface>): OfferingsBundlesMapInterface {
    return list.reduce((resultMap: OfferingsBundlesMapInterface, bundle: OfferingsBundleInterface) => {
      return Object.assign(resultMap, {
        [bundle.id]: bundle
      });
    }, {});
  }

  constructor(private offeringsApiService: OfferingsApiService,
              private brandParamsService: BrandParamsService) {
    this.brandId = this.brandParamsService.getBrandId();
    this.pricesSubject$ = new BehaviorSubject(null);
    this.offersSubject$ = new BehaviorSubject(null);
    this.activeCombosSubject$ = new BehaviorSubject(null);
    this.activeBundlesSubject$ = new BehaviorSubject(null);
    this.subscriptionDiscountsSubject$ = new BehaviorSubject(null);

    this.updateOffers();
  }

  updateOffers(): void {
    this.loadPrices();
    this.loadOffers();
    this.loadActiveCombos();
    this.loadActiveBundles();
    this.loadSubscriptionDiscounts();
  }

  private loadPrices(): void {
    this.offeringsApiService.getPrices(this.brandId)
      .subscribe((prices: OfferingsPricesMapInterface) => this.pricesSubject$.next(prices));
  }

  private loadOffers(): void {
    this.offeringsApiService.getOffers(this.brandId)
      .subscribe((offers: OfferingsOffersMapInterface) => this.offersSubject$.next(offers));
  }

  private loadActiveCombos(): void {
    this.offeringsApiService.getCombos(this.brandId, ['active'])
      .subscribe((combos: Array<any>) => this.activeCombosSubject$.next(combos));
  }

  private loadActiveBundles(): void {
    this.offeringsApiService.getBundles(this.brandId, ['active'])
      .subscribe((bundles: Array<any>) => this.activeBundlesSubject$.next(bundles));
  }

  private loadSubscriptionDiscounts(): void {
    this.offeringsApiService.getSubscriptionDiscounts(this.brandId)
      .subscribe((subscriptionDiscounts: Array<OfferingsSubscriptionDiscountInterface>) => this.subscriptionDiscountsSubject$
        .next(subscriptionDiscounts));
  }

  getPrices(): Observable<OfferingsPricesMapInterface> {
    return this.pricesSubject$.asObservable()
      .filter((prices: OfferingsPricesMapInterface) => prices !== null);
  }

  getOffers(): Observable<OfferingsOffersMapInterface> {
    return this.offersSubject$.asObservable()
      .filter((offers: OfferingsOffersMapInterface) => offers !== null);
  }

  getActiveCombosMap(): Observable<OfferingsCombosMapInterface> {
    return this.activeCombosSubject$.asObservable()
      .filter((combos: Array<OfferingsComboInterface> | null) => combos !== null)
      .map((combos: Array<OfferingsComboInterface>) => OfferingsService.convertCombosListToMap(combos));
  }

  getActiveBundlesMap(): Observable<OfferingsBundlesMapInterface> {
    return this.activeBundlesSubject$.asObservable()
      .filter((bundles: Array<OfferingsBundleInterface> | null) => bundles !== null)
      .map((bundles: Array<OfferingsBundleInterface>) => OfferingsService.convertBundlesListToMap(bundles));
  }

  getFreeLinesOffersMap(): Observable<OfferingsFreeLinesOffersMapInterface> {
    return this.getOffers()
      .map((offersMap: OfferingsOffersMapInterface) => {
        const freeLinesMap = {};
        Object.keys(offersMap).forEach((lotteryId) => {
          const freeLinesOffer = offersMap[lotteryId].filter(offer => offer.offer_type === 'free_lines')[0];
          if (freeLinesOffer) {
            freeLinesMap[lotteryId] = freeLinesOffer;
          }
        });

        return freeLinesMap;
      });
  }

  private getLotteryOffers(lotteryId: string): Observable<OfferInterface[] | null> {
    return this.getOffers()
      .map((offers: OfferingsOffersMapInterface) => offers[lotteryId] || null);
  }

  getLotteryFreeLinesOffer(lotteryId: string): Observable<OfferFreeLinesInterface | null> {
    return this.getLotteryOffers(lotteryId)
      .map((offers: Array<OfferInterface> | null) => (offers === null) ? offers : offers
        .filter((offer: OfferInterface) => offer.offer_type === 'free_lines'))
      .map((offers: Array<OfferInterface> | null) => (offers === null) ? null : (offers.length === 0) ? null : offers[0]);
  }

  getSubscriptionDiscounts(): Observable<OfferingsSubscriptionDiscountInterface[]> {
    return this.subscriptionDiscountsSubject$.asObservable();
  }

  getLotterySubscriptionDiscounts(lotteryId: string): Observable<OfferingsSubscriptionDiscountInterface[]> {
    return this.getSubscriptionDiscounts().map((value: Array<OfferingsSubscriptionDiscountInterface>) => {
      let result = value.filter(val => val.lottery_id === lotteryId);
      if (result.length === 0) {
        result = value.filter(val => val.lottery_id === null);
      }
      return result;
    });
  }

  getComboSubscriptionDiscounts(comboId: string): Observable<OfferingsSubscriptionDiscountInterface[]> {
    return this.getSubscriptionDiscounts().map((value: Array<OfferingsSubscriptionDiscountInterface>) => {
      return value.filter(val => val.lottery_id === null);
    });
  }

  getBundleSubscriptionDiscounts(bundleId: string): Observable<OfferingsSubscriptionDiscountInterface[]> {
    return this.getSubscriptionDiscounts().map((value: Array<OfferingsSubscriptionDiscountInterface>) => {
      return value.filter(val => val.lottery_id === null);
    });
  }
}
