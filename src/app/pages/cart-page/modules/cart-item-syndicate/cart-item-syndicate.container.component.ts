import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CurrencyService } from '../../../../services/auth/currency.service';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { CartSyndicateItemModel } from '../../../../models/cart/cart-syndicate-item.model';
import { OfferingsTotalPriceInterface } from '../../../../modules/api/entities/incoming/offerings/offerings-total-price.interface';
import { Cart2Service } from '../../../../services/cart2/cart2.service';
import { OfferingsApiService } from '../../../../modules/api/offerings.api.service';
import { BrandParamsService } from '../../../../modules/brand/services/brand-params.service';
import { CartItemPrice } from '../../../../services/cart2/entities/cart-item-price-map';
import { CartItemModel } from '../../../../models/cart/cart-item.model';
import { LightboxesService } from '../../../../modules/lightboxes/services/lightboxes.service';
import { AnalyticsDeprecatedService } from '../../../../modules/analytics-deprecated/services/analytics-deprecated.service';
import { LotteryInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { DrawInterface } from '../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { DrawsService } from '../../../../services/lotteries/draws.service';
import { Cart2SyndicateService } from '../../../../services/cart2/cart2-syndicate.service';
import { Subject } from 'rxjs/Subject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../store/reducers/index';
import {
  CartSyndicateAddShareAction,
  CartSyndicatePageLoadedAction,
  CartSyndicateRemoveShareAction
} from '../../../../store/actions/cart.actions';

@Component({
  selector: 'app-cart-item-syndicate-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-cart-item-syndicate
      [item]="item"
      [expandedLines]="expandedLines"
      [itemPrice]="itemPrice$ | async"
      [currencyId]="currencyId$ | async"
      [syndicateTemplate]="syndicateTemplate$ | async"
      [lottery]="lottery$ | async"
      [upcomingDraw]="upcomingDraw$ | async"
      (deleteItemEvent)="onDeleteItemEvent($event)"
      (addShare)="addShare($event)"
      (removeShare)="removeShare($event)"
      (setShares)="setShares($event)"
    ></app-cart-item-syndicate>
  `
})
export class CartItemSyndicateContainerComponent implements OnInit, OnDestroy {

  @Input() item: CartSyndicateItemModel;
  @Input() expandedLines: boolean;

  itemPrice$: Observable<CartItemPrice>;
  currencyId$: Observable<string>;
  syndicateTemplate$: Observable<SyndicateModel>;
  lottery$: Observable<LotteryInterface>;
  upcomingDraw$: Observable<DrawInterface>;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private syndicatesQueryService: SyndicatesQueryService,
              private currencyService: CurrencyService,
              private cart2Service: Cart2Service,
              private offeringsApiService: OfferingsApiService,
              private brandParamsService: BrandParamsService,
              private lightboxesService: LightboxesService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private lotteriesService: LotteriesService,
              private drawsService: DrawsService,
              private cart2SyndicateService: Cart2SyndicateService,
              private store: Store<fromRoot.State>) {
    this.currencyId$ = this.currencyService.getCurrencyId().publishReplay(1).refCount();
  }

  ngOnInit(): void {
    this.syndicateTemplate$ = this.syndicatesQueryService.getSyndicateModelByLotteryId(this.item.lotteryId)
      .pipe(
        filter((syndicateModel: SyndicateModel) => typeof syndicateModel !== 'undefined')
      );
    this.lottery$ = this.lotteriesService.getLottery(this.item.lotteryId)
      .pipe(
        filter((lottery: LotteryInterface) => typeof lottery !== 'undefined')
      ).publishReplay(1).refCount();

    this.upcomingDraw$ = this.lottery$
      .pipe(
        switchMap((lottery: LotteryInterface) => this.drawsService.getUpcomingDraw(lottery.id))
      );

    this.itemPrice$ = combineLatest(
      this.currencyId$,
      this.cart2Service.getItem$(this.item.id)
        .pipe(
          distinctUntilChanged((a: CartSyndicateItemModel, b: CartSyndicateItemModel) => {
            return (a ? a.numShares : 0) === (b ? b.numShares : 0);
          })
        )
    )
      .pipe(
        debounceTime(500),
        switchMap(([currencyId, cartItem]: [string, CartItemModel]) => {
          return this.offeringsApiService.getTotalPrice(
            this.brandParamsService.getBrandId(),
            currencyId,
            [],
            [],
            [],
            [(<CartSyndicateItemModel>cartItem).getSyndicateObject()]
          )
            .map((value: OfferingsTotalPriceInterface) => {
              return {
                price: value.customer_original_amount,
                discount: value.customer_discount_amount,
                priceWithDiscount: value.customer_total_amount,
              };
            });
        })
      );

    this.store.dispatch(new CartSyndicatePageLoadedAction({lotteryId: this.item.lotteryId, sharesAmount: this.item.numShares}));
  }

  onDeleteItemEvent(item: CartItemModel): void {
    this.lightboxesService.show({
      type: 'delete-cart-item-lightbox',
      payload: { item },
      closeHandler: () => {
        this.onCloseDeleteItem();
      },
      buttons: [
        {
          type: 'close',
          handler: () => {
            this.onCloseDeleteItem();
          }
        },
        {
          type: 'confirm',
          handler: () => {
            this.onConfirmDeleteItem(item);
          }
        },
      ],
    });

    this.analyticsDeprecatedService.trackCartTrashIconClick(item);
  }

  onConfirmDeleteItem(item: CartItemModel): void {
    this.cart2Service.deleteItems([item.id]);
    this.analyticsDeprecatedService.trackCartRemoveFromCartClick(item);
  }

  onCloseDeleteItem(): void {
    this.analyticsDeprecatedService.trackCartInteractionClick('keep for luck');
  }

  addShare(templateId: number): void {
    this.cart2SyndicateService.setShares(templateId, this.item.numShares + 1);
    this.store.dispatch(new CartSyndicateAddShareAction({sharesAmount: this.item.numShares}));
  }

  removeShare(templateId: number): void {
    this.cart2SyndicateService.removeShares(templateId, 1);
    this.store.dispatch(new CartSyndicateRemoveShareAction({sharesAmount: this.item.numShares}));
  }

  setShares({ templateId, numShares }: { templateId: number, numShares: number }): void {
    if (numShares < 1) {
      return;
    }

    if (this.item.numShares > numShares) {
      this.cart2SyndicateService.removeShares(templateId, this.item.numShares - numShares);
    } else {
      this.cart2SyndicateService.setShares(templateId, numShares);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
