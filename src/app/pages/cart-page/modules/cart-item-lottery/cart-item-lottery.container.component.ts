import { ChangeDetectionStrategy, Component, Input, OnInit, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { DrawsService } from '../../../../services/lotteries/draws.service';
import { OfferingsService } from '../../../../services/offerings/offerings.service';
import { CurrencyService } from '../../../../services/auth/currency.service';
import { Cart2Service } from '../../../../services/cart2/cart2.service';
import { Cart2LotteryService } from '../../../../services/cart2/cart2-lottery.service';
import { LightboxesService } from '../../../../modules/lightboxes/services/lightboxes.service';

import { CartLotteryItemModel } from '../../../../models/cart/cart-lottery-item.model';
import { CartItemPrice } from '../../../../services/cart2/entities/cart-item-price-map';
import { BrandParamsService } from '../../../../modules/brand/services/brand-params.service';
import { CartItemModel } from '../../../../models/cart/cart-item.model';
import { LinesService } from '../../../../services/lines.service';
import { ScrollService } from '../../../../services/device/scroll.service';

import * as fromRoot from '../../../../store/reducers/index';
import { Store } from '@ngrx/store';
import {
  OfferingsSubscriptionDiscountInterface
} from '../../../../modules/api/entities/incoming/offerings/offerings-subscription-discounts.interface';
import { OfferingsApiService } from '../../../../modules/api/offerings.api.service';
import { SubscriptionInterface } from '../../../../modules/api/entities/outgoing/common/subscription.interface';
import { LotteryInterface, LotteryRulesInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../../modules/api/entities/incoming/lotteries/draws.interface';
import {
  OfferFreeLinesInterface, OfferingsFreeLinesOffersMapInterface
} from '../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import { AnalyticsDeprecatedService } from '../../../../modules/analytics-deprecated/services/analytics-deprecated.service';
import * as cartActions from '../../../../store/actions/cart.actions';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { LineInterface } from '../../../../modules/api/entities/outgoing/common/line.interface';
import { OfferingsTotalPriceInterface } from '../../../../modules/api/entities/incoming/offerings/offerings-total-price.interface';

@Component({
  selector: 'app-cart-item-lottery-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-cart-item-lottery
      [item]="item"
      [index]="index"
      [lottery]="lottery$ | async"
      [upcomingDraw]="upcomingDraw$ | async"
      [freeLinesOffer]="freeLinesOffer$ | async"
      [siteCurrencyId]="siteCurrencyId$ | async"
      [renewPeriods]="renewPeriods$ | async"
      [itemPrice]="itemPrice$ | async"
      [skipFirstDrawParam]="skipFirstDrawParam$ | async"
      [expandedLines]="expandedLines"

      (openLinesClickEvent)="onOpenLinesClickEvent()"
      (closeLinesClickEvent)="onCloseLinesClickEvent()"
      (renewPeriodChangeEvent)="onRenewPeriodChangeEvent($event)"
      (deleteItemEvent)="onDeleteItemEvent($event)"
      (deleteLineEvent)="onDeleteLineEvent($event)"
      (editLineEvent)="onEditLineEvent($event)"
      (addAutoselectedLineEvent)="onAddAutoselectedLineEvent($event)"
      (removeLastLineEvent)="onRemoveLastLineEvent($event)"
      (setLinesNumberEvent)="onSetLinesNumber($event)"
      (addFreeLinesEvent)="onAddFreeLinesEvent($event)"
      (scrollToEvent)="onScrollTo($event)"
      (changeSubsription)="onChangeSubsription($event)"
      (showSubscriptionsTooltip)="onShowSubscriptionsTooltip()"
    ></app-cart-item-lottery>
  `,
})
export class CartItemLotteryContainerComponent implements OnInit {
  @Input() item: CartLotteryItemModel;
  @Input() index: number;
  @Input() expandedLines: boolean;

  lottery$: Observable<LotteryInterface>;
  upcomingDraw$: Observable<DrawInterface>;
  freeLinesOffer$: Observable<OfferFreeLinesInterface>;
  siteCurrencyId$: Observable<string>;
  renewPeriods$: Observable<OfferingsSubscriptionDiscountInterface[]>;
  itemPrice$: Observable<CartItemPrice>;
  skipFirstDrawParam$: Observable<string | null>;

  constructor(private store: Store<fromRoot.State>,
              private lotteriesService: LotteriesService,
              private drawsService: DrawsService,
              private offeringsService: OfferingsService,
              private offeringsApiService: OfferingsApiService,
              private currencyService: CurrencyService,
              private brandParamsService: BrandParamsService,
              private cart2Service: Cart2Service,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private cart2LotteryService: Cart2LotteryService,
              private lightboxesService: LightboxesService,
              private renderer: Renderer2,
              private linesService: LinesService,
              private scrollService: ScrollService) {
  }

  ngOnInit(): void {
    this.lottery$ = this.lotteriesService.getSoldLotteriesMap().pluck(this.item.lotteryId);
    this.upcomingDraw$ = this.drawsService.getUpcomingDrawsMap().pluck(this.item.lotteryId);
    this.freeLinesOffer$ = this.offeringsService.getFreeLinesOffersMap().pluck(this.item.lotteryId);
    this.siteCurrencyId$ = this.currencyService.getCurrencyId();
    this.renewPeriods$ = this.offeringsService.getLotterySubscriptionDiscounts(this.item.lotteryId);
    this.skipFirstDrawParam$ = this.store.select(fromRoot.getSkipFirstDrawParam);

    this.itemPrice$ = combineLatest(
      this.cart2Service.getItem$(this.item.id).distinctUntilChanged((a: CartLotteryItemModel, b: CartLotteryItemModel) => {
        return (a ? a.lines.length : 0) === (b ? b.lines.length : 0) && (a ? a.renewPeriod : null) === (b ? b.renewPeriod : null);
      }),
      this.offeringsService.getPrices(),
      this.offeringsService.getOffers(),
      this.siteCurrencyId$,
    )
      .debounceTime(500)
      .switchMap(([item, prices, offers, currencyId]) => {
        const lotteryItem = item as CartLotteryItemModel;
        const lines: Array<LineInterface> = lotteryItem.renewPeriod === null ? lotteryItem.lines : [];
        const subscriptions: Array<SubscriptionInterface> = lotteryItem.renewPeriod === null ? [] : [{
          renew_period: lotteryItem.renewPeriod,
          lines: lotteryItem.lines,
          // combos: [],
        }];

        return this.offeringsApiService.getTotalPrice(this.brandParamsService.getBrandId(), currencyId, lines, [], [], subscriptions)
          .map((value: OfferingsTotalPriceInterface) => {
            return {
              price: value.customer_original_amount,
              discount: value.customer_discount_amount,
              priceWithDiscount: value.customer_total_amount,
            };
          });
      });
  }

  onOpenLinesClickEvent(): void {
    this.analyticsDeprecatedService.trackCartOpenTicketClick();
  }

  onCloseLinesClickEvent(): void {
    this.analyticsDeprecatedService.trackCartCloseTicketClick();
  }

  onRenewPeriodChangeEvent({item, value}: {item: CartLotteryItemModel, value: string | null}): void {
    this.cart2LotteryService.changeRenewPeriod(item.lotteryId, value);
  }

  onDeleteItemEvent(item: CartItemModel): void {
    this.lightboxesService.show({
      type: 'delete-cart-item-lightbox',
      payload: {item},
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

  onDeleteLineEvent(line: LineInterface): void {
    this.lightboxesService.show({
      type: 'delete-cart-line-lightbox',
      payload: {line},
      closeHandler: () => {
        this.onCloseDeleteLine();
      },
      buttons: [
        {
          type: 'close',
          handler: () => {
            this.onCloseDeleteLine();
          }
        },
        {
          type: 'confirm',
          handler: () => {
            this.onConfirmDeleteLine(line);
          }
        },
      ],
    });
  }

  onConfirmDeleteLine(line: LineInterface): void {
    this.cart2LotteryService.deleteLines(line.lottery_id, [line].map(ln => ln.id));
    this.analyticsDeprecatedService.trackCartEditLineSaveClick();
  }

  onCloseDeleteLine(): void {
    this.analyticsDeprecatedService.trackCartInteractionClick('lucky line');
  }

  onEditLineEvent({item, editedLine}: {item: CartLotteryItemModel, editedLine: LineInterface}): void {
    this.lotteriesService.getLotteryRules(editedLine.lottery_id)
      .first()
      .subscribe((rules: LotteryRulesInterface) => {
        let lineIndex = 0;
        for (let i = 0; i < item.lines.length; i++) {
          if (item.lines[i].id === editedLine.id) {
            lineIndex = i + 1;
          }
        }

        this.lightboxesService.show({
          type: 'edit-line-lightbox',
          payload: {item, editedLine, lineIndex, rules},
          closeHandler: () => {
            this.onCloseEditLine();
          },
          buttons: [
            {
              type: 'save',
              handler: (payload: {item: CartItemModel, editedLine: LineInterface}) => {
                this.onSaveEditLine(payload.editedLine);
              }
            },
          ],
        });

        // MG-2270 Cart Page - Can't Click "Save" Button Due To Big Popup (physical iPhone 6)
        // const bodyElement = this.renderer.selectRootElement('body');
        this.renderer.addClass(document.body, 'fixed');

        this.analyticsDeprecatedService.trackCartEditLineClick();
      });
  }

  onSaveEditLine(editedLine: LineInterface): void {
    this.renderer.removeClass(document.body, 'fixed');

    if (editedLine.main_numbers.length === 0 && editedLine.extra_numbers.length === 0 && !editedLine.isFree) {
      this.cart2LotteryService.deleteLines(editedLine.lottery_id, [editedLine].map(line => line.id));
    } else {
      editedLine = this.linesService.autoselect(editedLine, false);
      this.cart2LotteryService.updateLine(editedLine.lottery_id, editedLine);
    }

    this.analyticsDeprecatedService.trackCartEditLineSaveClick();
  }

  onCloseEditLine(): void {
    this.renderer.removeClass(document.body, 'fixed');
  }

  onAddAutoselectedLineEvent(lotteryId: string): void {
    combineLatest(
      this.lotteriesService.getLottery(lotteryId),
      this.cart2Service.getItems$(),
    )
      .first()
      .subscribe(([lottery, items]) => {
        const item = this.cart2LotteryService.createMinLotteryItem(lottery, items, true);
        this.cart2LotteryService.addItems([item], false);
      });

    this.cart2LotteryService.getNumberOfLotteryLines$(lotteryId)
      .first()
      .subscribe((num: number) => {
        this.analyticsDeprecatedService.trackCartAddLineClick(lotteryId, num);
      });
  }

  onRemoveLastLineEvent(lotteryId: string): void {
    this.cart2LotteryService.getLotteryItem$(lotteryId)
      .first()
      .subscribe((item: CartLotteryItemModel | undefined) => {
        if (typeof item !== 'undefined') {
          const nonFreeLines = item.lines.filter(line => line.isFree === false);
          const lineToRemove = nonFreeLines[nonFreeLines.length - 1];
          this.analyticsDeprecatedService.trackCartRemoveLineClick(lotteryId, item.lines.length - 1);
          this.cart2LotteryService.deleteLines(lotteryId, [lineToRemove].map(line => line.id));
        }
      });
  }

  onSetLinesNumber({lotteryId, value}: {lotteryId: string, value: number}): void {
    this.cart2LotteryService.getLotteryItem$(lotteryId)
      .first()
      .subscribe((item: CartLotteryItemModel) => {
        if (item.lines.length > value) {
          if (value < 1) {
            return;
          }

          const linesToDelete = item.lines.slice(-(item.lines.length - value));
          this.cart2LotteryService.deleteLines(lotteryId, linesToDelete.map(line => line.id));
        } else if (item.lines.length < value) {
          const linesQuantityToAdd = value - item.lines.length;
          const toAddLines = this.linesService.generateAutoselectedLines(lotteryId, linesQuantityToAdd);
          this.cart2LotteryService.addItems([new CartLotteryItemModel(lotteryId, toAddLines)], false);
        }
      });
  }

  onAddFreeLinesEvent({lotteryId, addFreeLinesText}: {lotteryId: string, addFreeLinesText: string}): void {
    this.analyticsDeprecatedService.trackAddFreeLinesClick(lotteryId, addFreeLinesText);

    combineLatest(
      this.cart2LotteryService.getLotteryItem$(lotteryId),
      this.offeringsService.getFreeLinesOffersMap(),
    )
      .first()
      .subscribe(([item, freeLinesOffersMap]: [CartLotteryItemModel | undefined, OfferingsFreeLinesOffersMapInterface]) => {
        const nonFreeLinesNumber: number = item ? item.lines.filter(line => !line.isFree).length : 0;
        const freeLinesOffer: OfferFreeLinesInterface = freeLinesOffersMap[lotteryId];

        if (typeof freeLinesOffer === 'undefined') {
          return;
        }

        const linesToQualify = freeLinesOffer.details.lines_to_qualify;
        const linesFree = freeLinesOffer.details.lines_free;

        const nonFreeLinesLeftToAdd = linesToQualify - nonFreeLinesNumber % linesToQualify;
        const toAddLines = [];

        for (let i = 0; i < nonFreeLinesLeftToAdd; i++) {
          toAddLines.push(this.linesService.generateAutoselectedLine(lotteryId));
        }
        for (let i = 0; i < linesFree; i++) {
          toAddLines.push(this.linesService.generateAutoselectedFreeLine(lotteryId));
        }

        this.cart2LotteryService.addItems([new CartLotteryItemModel(lotteryId, toAddLines)], false);
      });
  }

  onScrollTo(nativeElement: HTMLElement): void {
    this.scrollService.scrollTo(nativeElement);
  }

  onShowSubscriptions(): void {
    this.lightboxesService.show({
      type: 'subscriptions',
      title: '<h1>Select your billing period</h1>',
      payload: {renewPeriods: this.renewPeriods$, item: this.item},
      closeHandler: () => {
        this.onCloseSubscription();
      },
      buttons: [
        {
          type: 'renew',
          handler: (payload: {item, period}) => {
            this.onSelectSubscription(payload.item, payload.period);
          }
        },
      ],
    });

    this.renderer.addClass(document.body, 'fixed');
  }

  onChangeSubsription({label, value}: {label: string, value: string | null}): void {
    this.onRenewPeriodChangeEvent({item: this.item, value});
    this.store.dispatch(new cartActions.ClickSubscribe({lotteryId: this.item.lotteryId}));
    this.store.dispatch(new cartActions.ChangeRenewPeriod({label, value}));
  }

  onSelectSubscription(item, period): void {
    this.onRenewPeriodChangeEvent({item: item, value: period});
    this.renderer.removeClass(document.body, 'fixed');
  }

  onCloseSubscription(): void {
    this.renderer.removeClass(document.body, 'fixed');
  }

  onShowSubscriptionsTooltip(): void {
    this.lightboxesService.show({
      type: 'general',
      title: '<h1>Subscription</h1>',
      message: 'Automatically participate in every draw. Billing will be done on a monthly basis.'
    });
  }
}
