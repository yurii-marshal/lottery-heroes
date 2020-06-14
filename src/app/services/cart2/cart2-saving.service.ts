import {Injectable} from '@angular/core';
import {WebStorageService} from '../storage/web-storage.service';
import {CartItemModel} from '../../models/cart/cart-item.model';
import {Cart2Service} from './cart2.service';
import {Cart2LotteryService} from './cart2-lottery.service';
import {Cart2ComboService} from './cart2-combo.service';
import {CartCustomerService} from './cart-customer.service';
import {CartLotteryItemModel} from '../../models/cart/cart-lottery-item.model';
import {AuthService} from '../auth/auth.service';
import {CartComboItemModel} from '../../models/cart/cart-combo-item.model';
import {LotteriesService} from '../lotteries/lotteries.service';
import {OfferingsService} from '../offerings/offerings.service';
import {CartItemsInterface} from '../../modules/api/entities/cart-items.interface';
import {SubscriptionInterface} from '../../modules/api/entities/outgoing/common/subscription.interface';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {first, switchMap, switchMapTo} from 'rxjs/operators';
import {GlobalService} from '../global.service';
import {CartSyndicateItemModel} from '../../models/cart/cart-syndicate-item.model';
import {Cart2SyndicateService} from './cart2-syndicate.service';
import {CartBundleItemModel} from '../../models/cart/cart-bundle-item.model';
import {Cart2BundleService} from './cart2-bundle.service';

@Injectable()
export class Cart2SavingService {
  readonly cartItemsStorageKey = 'cart2Items';

  constructor(private webStorageService: WebStorageService,
              private cart2Service: Cart2Service,
              private cart2LotteryService: Cart2LotteryService,
              private cart2ComboService: Cart2ComboService,
              private cart2BundleService: Cart2BundleService,
              private cartCustomerService: CartCustomerService,
              private authService: AuthService,
              private lotteriesService: LotteriesService,
              private offeringsService: OfferingsService,
              private globalService: GlobalService,
              private cart2SyndicateService: Cart2SyndicateService) {
    combineLatest(
      this.lotteriesService.getSoldLotteriesMap(),
      this.offeringsService.getFreeLinesOffersMap(),
      this.offeringsService.getActiveCombosMap(),
      this.offeringsService.getActiveBundlesMap()
    )
      .distinctUntilChanged()
      .skip(1)
      .switchMapTo(this.cart2Service.getItems$().first())
      .subscribe((items) => this.checkAndUpdateItems(items));

    this.cart2Service.getItems$()
      .debounceTime(500)
      .subscribe((items: Array<CartItemModel>) => {
        this.saveItemsList(items);
      });

    this.cartCustomerService.getCustomerCart$()
      .subscribe((cart: CartItemsInterface) => this.updateCart(cart));

    this.restoreItemsList();
  }

  private updateCart(cart: CartItemsInterface): void {
    this.cart2Service.getNumberOfItems$()
      .first()
      .subscribe((itemsNumber: number) => {
        // if empty cart load customer cart
        if (itemsNumber === 0) {
          const cartLotteryItems = this.cart2LotteryService.convertLinesToItems(cart.lines);
          const cartComboItems = this.cart2ComboService.convertCombosToItems(cart.combos);
          const cartBundleItems = this.cart2BundleService.convertBundlesToItems(cart.bundles);
          let cartSubscriptionItems = [];
          if (typeof cart.subscriptions !== 'undefined') {
            cartSubscriptionItems = this.convertSubscriptionsToItems(cart.subscriptions);
          }

          let cartSyndicateItems = [];

          if (typeof cart.shares !== 'undefined') {
            cartSyndicateItems = this.cart2SyndicateService.convertSyndicatesToItems(cart.shares);
          }
          const items: Array<CartItemModel> = [
            ...cartLotteryItems,
            ...cartComboItems,
            ...cartBundleItems,
            ...cartSubscriptionItems,
            ...cartSyndicateItems
          ];
          this.checkAndUpdateItems(items);
        }
      });
  }

  private convertSubscriptionsToItems(subscriptions: Array<SubscriptionInterface>): Array<CartItemModel> {
    let items: Array<CartItemModel> = [];

    subscriptions.forEach((subscription: SubscriptionInterface) => {
      if (subscription.lines.length > 0) {
        items = [...items, ...this.cart2LotteryService.convertLinesToItems(subscription.lines)
          .map(item => {
            item.renewPeriod = subscription.renew_period;
            return item;
          })];
      } else if (subscription.combos.length > 0) {
        items = [...items, ...this.cart2ComboService.convertCombosToItems(subscription.combos)
          .map(item => {
            item.renewPeriod = subscription.renew_period;
            return item;
          })];
      } else if (subscription.bundles.length > 0) {
        items = [...items, ...this.cart2BundleService.convertBundlesToItems(subscription.bundles)
          .map(item => {
            item.renewPeriod = subscription.renew_period;
            return item;
          })];
      }
    });

    return items;
  }

  private saveItemsList(itemsList: Array<CartItemModel>): void {
    // console.log(itemsList);
    const itemsSerialized = itemsList.map((item: CartItemModel) => item.getSerializedObject());
    this.webStorageService.setItem(this.cartItemsStorageKey, itemsSerialized);

    if (this.authService.isLoggedIn()) {
      this.cartCustomerService.updateCustomerCart(itemsList);
    }
  }

  restoreItemsList(): void {
    const itemsSerialized = this.webStorageService.getItem(this.cartItemsStorageKey) || [];
    const items = itemsSerialized.map((itemSerialized) => this.itemFactory(itemSerialized));
    this.checkAndUpdateItems(items);
  }

  private checkAndUpdateItems(items: Array<CartItemModel>): void {
    this.cart2LotteryService.checkAndUpdateItems(items)
      .pipe(
        switchMap((updatedItems: Array<CartItemModel>) => this.cart2ComboService.checkAndUpdateItems(updatedItems)),
        switchMap((updatedItems: Array<CartItemModel>) => this.cart2BundleService.checkAndUpdateItems(updatedItems)),
        switchMap((updatedItems: Array<CartItemModel>) => this.cart2SyndicateService.checkAndUpdateItems(updatedItems)),
        first()
      )
      .subscribe((updatedItems: Array<CartItemModel>) => {
        this.cart2Service.setItems(updatedItems);
      });
  }

  private itemFactory(itemSerialized): CartItemModel {
    switch (itemSerialized.type) {
      case 'lottery':
        return new CartLotteryItemModel(itemSerialized.lotteryId, itemSerialized.lines, itemSerialized.renewPeriod);
      case 'combo':
        return new CartComboItemModel(itemSerialized.comboId, itemSerialized.lines, itemSerialized.shares, itemSerialized.renewPeriod);
      case 'bundle':
        return new CartBundleItemModel(itemSerialized.bundleId, itemSerialized.lines, itemSerialized.shares, itemSerialized.renewPeriod);
      case 'syndicate':
        return new CartSyndicateItemModel(itemSerialized.templateId, itemSerialized.numShares, itemSerialized.lotteryId);
      default:
        throw new Error('Unknown cart item type');
    }
  }
}
