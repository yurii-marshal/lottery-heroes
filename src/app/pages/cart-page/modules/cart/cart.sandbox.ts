import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {Cart2Service} from '../../../../services/cart2/cart2.service';
import {WalletService} from '../../../../services/wallet.service';
import {CurrencyService} from '../../../../services/auth/currency.service';
import {OfferingsService} from '../../../../services/offerings/offerings.service';
import {LotteriesService} from '../../../../services/lotteries/lotteries.service';
import {DrawsService} from '../../../../services/lotteries/draws.service';
import {GlobalService} from '../../../../services/global.service';
import {CustomerService} from '../../../../services/auth/customer.service';
import {AnalyticsDeprecatedService} from '../../../../modules/analytics-deprecated/services/analytics-deprecated.service';

import {BalanceInterface} from '../../../../services/api/entities/incoming/wallet/balance.interface';
import {LotteriesMapInterface} from '../../../../services/lotteries/entities/interfaces/lotteries-map.interface';
import {DrawsMapInterface} from '../../../../services/lotteries/entities/interfaces/draws-map.interface';
import {CustomerInterface} from '../../../../services/auth/entities/interfaces/customer.interface';
import {LotteriesSortService} from '../../../../services/lotteries/lotteries-sort.service';
import {LuvService} from '../../../../services/luv.service';
import {CartItemModel} from '../../../../models/cart/cart-item.model';
import {Cart2LotteryService} from '../../../../services/cart2/cart2-lottery.service';
import {CartLotteryItemModel} from '../../../../models/cart/cart-lottery-item.model';
import {OfferingsCombosMapInterface} from '../../../../services/offerings/entities/offerings-combos-map.interface';
import {CartItemPriceMap} from '../../../../services/cart2/entities/cart-item-price-map';
import {LightboxesService} from '../../../../modules/lightboxes/services/lightboxes.service';
import {LotteryInterface} from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import {
  OfferingsFreeLinesOffersMapInterface
} from '../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import {OfferingsTotalPriceInterface} from '../../../../modules/api/entities/incoming/offerings/offerings-total-price.interface';
import {SyndicateModel} from '@libs/biglotteryowin-core/models/syndicate.model';
import {OfferingsBundlesMapInterface} from '../../../../services/offerings/entities/offerings-bundles-map.interface';

@Injectable()
export class CartSandbox {
  constructor(private cart2Service: Cart2Service,
              private cart2LotteryService: Cart2LotteryService,
              private walletService: WalletService,
              private currencyService: CurrencyService,
              private offeringsService: OfferingsService,
              private lotteriesService: LotteriesService,
              private drawsService: DrawsService,
              private globalService: GlobalService,
              private customerService: CustomerService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private lotteriesSortService: LotteriesSortService,
              private luvService: LuvService,
              private lightboxesService: LightboxesService) {
  }

  getItems$(): Observable<CartItemModel[]> {
    return this.cart2Service.getItems$();
  }

  getTotalPriceWithDiscount$(): Observable<OfferingsTotalPriceInterface> {
    return this.cart2Service.getTotalPriceWithDiscount$();
  }

  getCustomerBalance$(): Observable<BalanceInterface> {
    return this.walletService.getCustomerBalance();
  }

  getSiteCurrencyId$(): Observable<string> {
    return this.currencyService.getCurrencyId();
  }

  getFreeLinesOffersMap$(): Observable<OfferingsFreeLinesOffersMapInterface> {
    return this.offeringsService.getFreeLinesOffersMap();
  }

  getLotteriesMap$(): Observable<LotteriesMapInterface> {
    return this.lotteriesService.getSoldLotteriesMap();
  }

  getCombosMap$(): Observable<OfferingsCombosMapInterface> {
    return this.offeringsService.getActiveCombosMap();
  }

  getBundlesMap$(): Observable<OfferingsBundlesMapInterface> {
    return this.offeringsService.getActiveBundlesMap();
  }

  getUpcomingDrawsMap$(): Observable<DrawsMapInterface> {
    return this.drawsService.getUpcomingDrawsMap();
  }

  getItemPriceMap$(): Observable<CartItemPriceMap> {
    return this.cart2Service.getItemPriceMap$();
  }

  getLotteryIdsNotInCart$(): Observable<string[]> {
    return this.lotteriesSortService.getCartOffersLotteryIds();
  }

  getLessThanMinLotteryItems$(): Observable<CartLotteryItemModel[]> {
    return this.cart2LotteryService.getLessThanMinLotteryItems$();
  }

  getLottery$(lotteryId: string): Observable<LotteryInterface | undefined> {
    return this.lotteriesService.getLottery(lotteryId);
  }

  getCartItems$(): Observable<CartItemModel[]> {
    return this.cart2Service.getItems$();
  }

  createMinLotteryItem(lottery: LotteryInterface, items: Array<CartItemModel>): CartLotteryItemModel {
    return this.cart2LotteryService.createMinLotteryItem(lottery, items, true);
  }

  addToCart(item: CartLotteryItemModel): void {
    this.cart2LotteryService.addItems([item], false);
  }

  trackAddToCartClick(item: CartItemModel): void {
    this.analyticsDeprecatedService.trackCartAddToCartClick(item);
  }

  showLimitedStatusModal(): void {
    this.globalService.showLightbox$.emit({name: 'limited-status', value: ''});
  }

  showAccountUnverifiedModal(): void {
    this.globalService.showLightbox$.emit({name: 'account-unverified', value: 'not verified'});
  }

  getCustomerStatusId$(): Observable<string | null> {
    return this.customerService.getCustomer()
      .map((customer: CustomerInterface | null) => customer ? customer.status_id : null);
  }

  getSyndicateModelsMap$(): Observable<SyndicateModel[]> {
    return this.lotteriesSortService.getSyndicates$();
  }

  showSessionLimitedLightbox() {
    this.lightboxesService.show({
      type: 'general',
      title: 'Lightboxes.sessionStatusTittle',
      message: 'Lightboxes.sessionStatusMessage',
    });
  }

  trackCartProceedToCheckout(): void {
    this.cart2Service.getTotalPriceWithDiscount$()
      .first()
      .subscribe((totalPriceWithDiscount: OfferingsTotalPriceInterface) => {
        this.analyticsDeprecatedService.trackCartProceedToCheckout(totalPriceWithDiscount.customer_total_amount);
      });
  }
}
