import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {BaseApiService} from './base.api.service';
import {OfferingsPricesInterface, OfferingsPricesMapInterface} from './entities/incoming/offerings/offerings-prices.interface';
import {LineInterface} from './entities/outgoing/common/line.interface';
import {OfferingsTotalPriceInterface} from './entities/incoming/offerings/offerings-total-price.interface';
import {OfferingsComboInterface, OfferingsCombosInterface} from './entities/incoming/offerings/offerings-combos.interface';
import {SubscriptionInterface} from './entities/outgoing/common/subscription.interface';
import {
  OfferingsSubscriptionDiscountInterface,
  OfferingsSubscriptionDiscountsInterface
} from './entities/incoming/offerings/offerings-subscription-discounts.interface';
import {
  OfferingsComboPriorityInterface,
  OfferingsCombosPrioritiesInterface
} from './entities/incoming/offerings/offerings-combos-priorities.interface';
import {OfferingsOffersInterface, OfferingsOffersMapInterface, OfferType} from './entities/incoming/offerings/offerings-offers.interface';
import {HttpParams} from '@angular/common/http';
import {
  OfferingsBundlePriorityInterface,
  OfferingsBundlesPrioritiesInterface
} from './entities/incoming/offerings/offerings-bundles-priorities.interface';
import {OfferingsBundleInterface, OfferingsBundlesInterface} from './entities/incoming/offerings/offerings-bundles.interface';

@Injectable()
export class OfferingsApiService {
  constructor(private baseApiService: BaseApiService) {
  }

  getPrices(brandId: string, lotteriesIds?: Array<string>): Observable<OfferingsPricesMapInterface> {
    let httpParams = new HttpParams();

    if (lotteriesIds) {
      httpParams = httpParams.set('lottery_id', lotteriesIds.join());
    }

    return this.baseApiService.get('/offerings/prices/' + brandId, httpParams)
      .map((result: OfferingsPricesInterface) => result.prices);
  }

  getCombos(brandId: string, statusIds?: Array<'active' | 'disabled'>): Observable<OfferingsComboInterface[]> {
    let httpParams = new HttpParams();

    if (statusIds) {
      httpParams = httpParams.set('status_id', statusIds.join());
    }

    return this.baseApiService.get('/offerings/combos/' + brandId, httpParams)
      .map((result: OfferingsCombosInterface) => result.combos);
  }

  getCombosPriorities(brandId: string, page?: string): Observable<OfferingsComboPriorityInterface[]> {
    let httpParams = new HttpParams();

    if (page) {
      httpParams = httpParams.set('page', page);
    }

    return this.baseApiService.get('/offerings/combos/priorities/' + brandId, httpParams)
      .map((result: OfferingsCombosPrioritiesInterface) => result.priorities);
  }

  getBundles(brandId: string, statusIds?: Array<'active' | 'disabled'>): Observable<OfferingsBundleInterface[]> {
    let httpParams = new HttpParams();

    if (statusIds) {
      httpParams = httpParams.set('status_id', statusIds.join());
    }

    return this.baseApiService.get('/offerings/bundles/' + brandId, httpParams)
      .map((result: OfferingsBundlesInterface) => result.bundles);
  }

  getBundlesPriorities(brandId: string, page?: string): Observable<OfferingsBundlePriorityInterface[]> {
    let httpParams = new HttpParams();

    if (page) {
      httpParams = httpParams.set('page', page);
    }

    return this.baseApiService.get('/offerings/bundles/priorities/' + brandId, httpParams)
      .map((result: OfferingsBundlesPrioritiesInterface) => result.priorities);
  }

  getOffers(brandId: string, offerTypes?: Array<OfferType>, lotteriesIds?: Array<string>): Observable<OfferingsOffersMapInterface> {
    let httpParams = new HttpParams();

    if (offerTypes) {
      httpParams = httpParams.set('offer_type', offerTypes.join());
    }

    if (lotteriesIds) {
      httpParams = httpParams.set('lottery_id', lotteriesIds.join());
    }

    return this.baseApiService.get('/offerings/offers/' + brandId, httpParams)
      .map((result: OfferingsOffersInterface) => result.offers);
  }

  getTotalPrice(brandId: string,
                currencyId: string,
                lines: Array<LineInterface> = [],
                combos: Array<any> = [],
                bundles: Array<any> = [],
                subscriptions: Array<SubscriptionInterface> = [],
                syndicates: Array<any> = []): Observable<OfferingsTotalPriceInterface> {

    return this.baseApiService.post('/offerings/total-price/' + brandId, {
      lines,
      combos,
      bundles,
      subscriptions,
      customer_currency_id: currencyId,
      shares: syndicates
    });
  }

  getSubscriptionDiscounts(brandId: string): Observable<OfferingsSubscriptionDiscountInterface[]> {
    return this.baseApiService.get('/offerings/subscription-discounts/' + brandId)
      .map((result: OfferingsSubscriptionDiscountsInterface) => result.subscription_discounts);
  }
}
