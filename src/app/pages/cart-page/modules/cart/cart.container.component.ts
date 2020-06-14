import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import {CartSandbox} from './cart.sandbox';

import {OfferingsTotalPriceInterface} from '../../../../modules/api/entities/incoming/offerings/offerings-total-price.interface';
import {BalanceInterface} from '../../../../services/api/entities/incoming/wallet/balance.interface';
import {LotteriesMapInterface} from '../../../../services/lotteries/entities/interfaces/lotteries-map.interface';
import {DrawsMapInterface} from '../../../../services/lotteries/entities/interfaces/draws-map.interface';

import {CartItemModel} from '../../../../models/cart/cart-item.model';
import {CartLotteryItemModel} from '../../../../models/cart/cart-lottery-item.model';
import {DOCUMENT} from '@angular/common';
import {OfferingsCombosMapInterface} from '../../../../services/offerings/entities/offerings-combos-map.interface';
import {CartItemPriceMap} from '../../../../services/cart2/entities/cart-item-price-map';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../../store/reducers/index';
import {Subject} from 'rxjs/Subject';
import {
  OfferFreeLinesInterface,
  OfferingsFreeLinesOffersMapInterface
} from '../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {OfferingsService} from '../../../../services/offerings/offerings.service';
import {distinctUntilChanged, first, skip, takeUntil} from 'rxjs/operators';
import {LinesService} from '../../../../services/lines.service';
import {ObjectsUtil} from '../../../../modules/shared/utils/objects.util';
import * as cartActions from '../../../../store/actions/cart.actions';
import {Cart2LotteryService} from '../../../../services/cart2/cart2-lottery.service';
import {GlobalService} from '../../../../services/global.service';
import {WalletService} from '../../../../services/wallet.service';
import {AuthService} from '../../../../services/auth/auth.service';
import {SyndicateModel} from '@libs/biglotteryowin-core/models/syndicate.model';
import {OfferingsBundlesMapInterface} from '../../../../services/offerings/entities/offerings-bundles-map.interface';
import {CashierPageSandbox} from '../../../cashier-page/cashier-page.sandbox';

@Component({
  selector: 'app-cart-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-cart
      [items]="items$|async"
      [totalPriceWithDiscount]="totalPriceWithDiscount$|async"
      [balance]="balance$|async"
      [siteCurrencyId]="siteCurrencyId$|async"
      [freeLinesOffersMap]="freeLinesOffersMap$|async"
      [lotteriesMap]="lotteriesMap$|async"
      [combosMap]="combosMap$|async"
      [bundlesMap]="bundlesMap$|async"
      [upcomingDrawsMap]="upcomingDrawsMap$|async"
      [itemPriceMap]="itemPriceMap$|async"
      [lotteryIdsNotInCart]="lotteryIdsNotInCart$|async"
      [expandedLines]="expandedLines"

      (checkoutEvent)="onCheckoutEvent()"
    ></app-cart>

    <app-notification-multiples-lines
      *ngIf="showNotificationMultiplesLinesItem"

      [item]="showNotificationMultiplesLinesItem"
      [lottery]="(lotteriesMap$|async)[showNotificationMultiplesLinesItem.lotteryId]"

      (close)="onCloseNotificationMultiplesLines()"
    ></app-notification-multiples-lines>
    <app-notification-dont-miss-out
      *ngIf="notificationDontMissOutData"
      [data]="notificationDontMissOutData"
      (close)="onCloseNotificationDontMissOut()"
      (cancel)="onCancelNotificationDontMissOut()"
      (addLinesToGetFree)="addLinesToGetFree($event)"
    ></app-notification-dont-miss-out>
  `
})
export class CartContainerComponent implements OnDestroy {
  @Input() expandedLines: boolean;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  items$: Observable<CartItemModel[]>;
  totalPriceWithDiscount$: Observable<OfferingsTotalPriceInterface>;
  balance$: Observable<BalanceInterface>;
  siteCurrencyId$: Observable<string>;
  freeLinesOffersMap$: Observable<OfferingsFreeLinesOffersMapInterface>;
  lotteriesMap$: Observable<LotteriesMapInterface>;
  combosMap$: Observable<OfferingsCombosMapInterface>;
  bundlesMap$: Observable<OfferingsBundlesMapInterface>;
  upcomingDrawsMap$: Observable<DrawsMapInterface>;
  itemPriceMap$: Observable<CartItemPriceMap>;
  lotteryIdsNotInCart$: Observable<string[]>;
  sessionStatus: string;
  lotteryIdDontMissOut: string;

  showNotificationMultiplesLinesItem: CartLotteryItemModel | null = null;
  notificationDontMissOutData: { lotteryId: string, linesToOffer: number } | null = null;

  constructor(private store: Store<fromRoot.State>,
              private sandbox: CartSandbox,
              private cashierSandbox: CashierPageSandbox,
              private router: Router,
              @Inject(DOCUMENT) private document,
              private offeringsService: OfferingsService,
              private lineService: LinesService,
              private cart2LotteryService: Cart2LotteryService,
              private globalService: GlobalService,
              private walletService: WalletService,
              private authService: AuthService,
              private wallet: WalletService,
              private changeDetectionRef: ChangeDetectorRef) {
    this.items$ = this.sandbox.getItems$();
    this.totalPriceWithDiscount$ = this.sandbox.getTotalPriceWithDiscount$();
    this.balance$ = this.sandbox.getCustomerBalance$();
    this.siteCurrencyId$ = this.sandbox.getSiteCurrencyId$();
    this.freeLinesOffersMap$ = this.sandbox.getFreeLinesOffersMap$();
    this.lotteriesMap$ = this.sandbox.getLotteriesMap$();
    this.combosMap$ = this.sandbox.getCombosMap$();
    this.bundlesMap$ = this.sandbox.getBundlesMap$();
    this.upcomingDrawsMap$ = this.sandbox.getUpcomingDrawsMap$();
    this.itemPriceMap$ = this.sandbox.getItemPriceMap$();
    this.lotteryIdsNotInCart$ = this.sandbox.getLotteryIdsNotInCart$();
    this.store.select(fromRoot.getSessionStatus)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((status: string) => this.sessionStatus = status);
  }

  onCloseNotificationMultiplesLines(): void {
    this.showNotificationMultiplesLinesItem = null;
  }

  onCheckoutEvent(): void {
    this.sandbox.trackCartProceedToCheckout();

    const observablesBatch: any[] = [
      this.offeringsService.getFreeLinesOffersMap(),
      this.sandbox.getCartItems$(),
      this.upcomingDrawsMap$
    ];

    if (this.authService.isLoggedIn()) {
      observablesBatch.push(this.walletService.getTransactionsCount({typeId: 1}));
    }

    this.cashierSandbox.getCurrentPaymentSystem$()
      .first()
      .subscribe(currentPaymentSystem => {
        if (currentPaymentSystem.mode === 'apcopay') {
          this.checkout();
        } else {
          combineLatest(observablesBatch)
            .pipe(
              first()
            )
            .subscribe(data => {
              const freeLinesOffersMap: OfferingsFreeLinesOffersMapInterface = data[0];
              const cartItems: CartItemModel[] = data[1];
              const upcomingDrawsMap: DrawsMapInterface = data[2];
              const depositTransactionsCount: number = data[3] ? data[3].count : 0;

              // Show popup only for customers who didn't make any deposit or purchase transaction yet.
              if (depositTransactionsCount > 0) {
                this.checkout();
                return;
              }

              const filteredCartItems = cartItems.filter((item: CartItemModel) => {
                if (item.type !== 'lottery') {
                  return false;
                }

                const cartLotteryItem: CartLotteryItemModel = item as CartLotteryItemModel;
                const freeLineOffer: OfferFreeLinesInterface = freeLinesOffersMap[cartLotteryItem.lotteryId];

                return typeof freeLineOffer !== 'undefined' && freeLineOffer.details.lines_to_qualify > cartLotteryItem.lines.length;
              });

              if (filteredCartItems.length === 0) {
                this.checkout();
                return;
              }

              let cartItemsWithMinLinesToOffer: CartItemModel[] = [];

              filteredCartItems.forEach((item: CartItemModel, index: number, array: CartItemModel[]) => {
                if (cartItemsWithMinLinesToOffer.length === 0) {
                  cartItemsWithMinLinesToOffer.push(item);
                  return;
                }

                const cartLotteryItemA = item as CartLotteryItemModel;
                const cartLotteryItemB = cartItemsWithMinLinesToOffer[0] as CartLotteryItemModel;
                const freeLineOfferA: OfferFreeLinesInterface = freeLinesOffersMap[cartLotteryItemA.lotteryId];
                const freeLineOfferB: OfferFreeLinesInterface = freeLinesOffersMap[cartLotteryItemB.lotteryId];
                const linesToOfferA = freeLineOfferA.details.lines_to_qualify - cartLotteryItemA.lines.length;
                const linesToOfferB = freeLineOfferB.details.lines_to_qualify - cartLotteryItemB.lines.length;

                if (linesToOfferA < linesToOfferB) {
                  cartItemsWithMinLinesToOffer = [item];
                } else if (linesToOfferA === linesToOfferB) {
                  cartItemsWithMinLinesToOffer.push(item);
                }
              });

              if (cartItemsWithMinLinesToOffer.length === 0) {
                return;
              }

              cartItemsWithMinLinesToOffer.sort((itemA: CartItemModel, itemB: CartItemModel) => {
                const cartLotteryItemA = itemA as CartLotteryItemModel;
                const cartLotteryItemB = itemB as CartLotteryItemModel;

                return upcomingDrawsMap[cartLotteryItemB.lotteryId].jackpot - upcomingDrawsMap[cartLotteryItemA.lotteryId].jackpot;
              });

              const cartItem: CartLotteryItemModel = cartItemsWithMinLinesToOffer[0] as CartLotteryItemModel;
              const linesToOffer: number = freeLinesOffersMap[cartItem.lotteryId].details.lines_to_qualify - cartItem.lines.length;
              this.lotteryIdDontMissOut = cartItem.lotteryId;

              if (linesToOffer > 0) {
                this.store.dispatch(new cartActions.ConditionForDealRelevant({lotteryId: this.lotteryIdDontMissOut}));
              }

              this.store.dispatch(new cartActions.OpenNotificationPopup({lotteryId: this.lotteryIdDontMissOut}));
              this.notificationDontMissOutData = {lotteryId: cartItem.lotteryId, linesToOffer};
              this.changeDetectionRef.markForCheck();
            });
        }
      });
  }

  isLimitedActivity(customerStatusId: string): boolean {
    if (this.sessionStatus === 'limited') {
      this.sandbox.showSessionLimitedLightbox();
      return true;
    }

    if (customerStatusId === 'limited') {
      this.sandbox.showLimitedStatusModal();
      return true;
    }

    if (customerStatusId === 'unverified') {
      this.sandbox.showAccountUnverifiedModal();
      return true;
    }
    return false;
  }

  onCloseNotificationDontMissOut(): void {
    this.store.dispatch(new cartActions.ClickNotificationClose({lotteryId: this.lotteryIdDontMissOut}));
    this.closeNotificationDontMissOut();
    this.checkout();
  }

  onCancelNotificationDontMissOut(): void {
    this.store.dispatch(new cartActions.ClickNotificationCancel({lotteryId: this.lotteryIdDontMissOut}));
    this.closeNotificationDontMissOut();
    this.checkout();
  }

  private closeNotificationDontMissOut(): void {
    this.notificationDontMissOutData = null;
  }

  addLinesToGetFree(lotteryId: string): void {
    combineLatest(
      this.offeringsService.getLotteryFreeLinesOffer(lotteryId),
      this.cart2LotteryService.getLotteryItem$(lotteryId),
      this.sandbox.getCartItems$()
    )
      .pipe(
        first()
      )
      .subscribe(data => {
        const freeLineOffer: OfferFreeLinesInterface = data[0];
        const cartLotteryItem: CartLotteryItemModel = data[1];
        const cartItems: CartItemModel[] = data[2];
        const clonedCartItems = ObjectsUtil.deepClone(cartItems);
        const itemIndex = clonedCartItems.findIndex((item: CartItemModel) => {
          const serializedItem = item.getSerializedObject();
          return serializedItem.lotteryId === lotteryId;
        });

        if (itemIndex < 0) {
          return;
        }

        const linesToAddLength = freeLineOffer.details.lines_to_qualify - cartLotteryItem.lines.length;
        const linesToAdd = this.lineService
          .generateAutoselectedLines(cartLotteryItem.lotteryId, linesToAddLength, freeLineOffer.details.lines_free);

        clonedCartItems[itemIndex] = new CartLotteryItemModel(
          lotteryId, [...cartLotteryItem.lines, ...linesToAdd], cartLotteryItem.getSerializedObject().renewPeriod
        );

        this.store.dispatch(new cartActions.SetCartItems(clonedCartItems));
      });

    // Check when total price will be updated to continue payment transaction.
    this.sandbox.getTotalPriceWithDiscount$()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        // emit value when customer_total_amount property value will be changed
        distinctUntilChanged((totalPriceA: OfferingsTotalPriceInterface, totalPriceB: OfferingsTotalPriceInterface) => {
          return totalPriceA.customer_total_amount === totalPriceB.customer_total_amount;
        }),
        // Skip first emitted value because distinctUntilChanged passed it because comparison function in
        // distinctUntilChanged operator needs two values for comparison.
        skip(1)
      )
      .subscribe(() => {
        if (this.notificationDontMissOutData) {
          this.store.dispatch(new cartActions.ClickNotificationAccept({lotteryId: this.lotteryIdDontMissOut}));
          this.closeNotificationDontMissOut();
          this.checkout();
        }
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private checkout() {
    combineLatest(
      this.sandbox.getLessThanMinLotteryItems$(),
      this.sandbox.getCustomerStatusId$()
    )
      .first()
      .subscribe(data => {
        const lessThanMinLotteryItems: Array<CartLotteryItemModel> = data[0];
        const customerStatusId: any = data[1];

        if (lessThanMinLotteryItems.length > 0) {
          this.showNotificationMultiplesLinesItem = lessThanMinLotteryItems[0];
        } else {
          if (!this.isLimitedActivity(customerStatusId)) {
            this.router.navigate(['/cashier'], {replaceUrl: true});
          }
        }
      });
  }
}
