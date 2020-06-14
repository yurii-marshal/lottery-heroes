import {ChangeDetectionStrategy, Component, Input, OnInit, Renderer2} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {DrawsMapInterface} from '../../../../services/lotteries/entities/interfaces/draws-map.interface';
import {CartItemPrice} from '../../../../services/cart2/entities/cart-item-price-map';
import {LotteriesMapInterface} from '../../../../services/lotteries/entities/interfaces/lotteries-map.interface';
import {LotteriesService} from '../../../../services/lotteries/lotteries.service';
import {DrawsService} from '../../../../services/lotteries/draws.service';
import {OfferingsService} from '../../../../services/offerings/offerings.service';
import {CurrencyService} from '../../../../services/auth/currency.service';
import {BrandParamsService} from '../../../../modules/brand/services/brand-params.service';
import {LuvService} from '../../../../services/luv.service';
import {AnalyticsDeprecatedService} from '../../../../modules/analytics-deprecated/services/analytics-deprecated.service';
import {Cart2Service} from '../../../../services/cart2/cart2.service';
import {LightboxesService} from '../../../../modules/lightboxes/services/lightboxes.service';
import {LinesService} from '../../../../services/lines.service';

import {CartItemModel} from '../../../../models/cart/cart-item.model';
import {
  OfferingsSubscriptionDiscountInterface
} from '../../../../modules/api/entities/incoming/offerings/offerings-subscription-discounts.interface';
import {OfferingsApiService} from '../../../../modules/api/offerings.api.service';
import {LotteryRulesInterface} from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {LineInterface} from '../../../../modules/api/entities/outgoing/common/line.interface';
import {OfferingsTotalPriceInterface} from 'app/modules/api/entities/incoming/offerings/offerings-total-price.interface';
import {SyndicateModel} from '@libs/biglotteryowin-core/models/syndicate.model';
import {SyndicatesQueryService} from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';
import {CartBundleItemModel} from '../../../../models/cart/cart-bundle-item.model';
import {BundleItemModel} from '../../../../models/bundle.model';
import {Cart2BundleService} from '../../../../services/cart2/cart2-bundle.service';
import {BundlesService} from '../../../../services/bundles/bundles.service';

@Component({
  selector: 'app-cart-item-bundle-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-cart-item-bundle
      [item]="item"
      [bundle]="bundle$ | async"
      [lotteriesMap]="lotteriesMap$ | async"
      [upcomingDrawsMap]="upcomingDrawsMap$ | async"
      [siteCurrencyId]="siteCurrencyId$ | async"
      [renewPeriods]="renewPeriods$ | async"
      [itemPrice]="itemPrice$ | async"
      [syndicatesMap]="syndicatesMap$ | async"
      [expandedLines]="expandedLines"

      (openLinesClickEvent)="onOpenLinesClickEvent()"
      (closeLinesClickEvent)="onCloseLinesClickEvent()"
      (renewPeriodChangeEvent)="onRenewPeriodChangeEvent($event)"
      (deleteItemEvent)="onDeleteItemEvent($event)"
      (editLineEvent)="onEditLineEvent($event)"
    ></app-cart-item-bundle>
  `,
})
export class CartItemBundleContainerComponent implements OnInit {
  @Input() item: CartBundleItemModel;
  @Input() expandedLines: boolean;

  bundle$: Observable<BundleItemModel>;
  lotteriesMap$: Observable<LotteriesMapInterface>;
  upcomingDrawsMap$: Observable<DrawsMapInterface>;
  siteCurrencyId$: Observable<string>;
  itemPrice$: Observable<CartItemPrice>;
  renewPeriods$: Observable<OfferingsSubscriptionDiscountInterface[]>;
  syndicatesMap$: Observable<{ [lotteryId: string]: SyndicateModel }>;

  constructor(private lotteriesService: LotteriesService,
              private drawsService: DrawsService,
              private offeringsService: OfferingsService,
              private offeringsApiService: OfferingsApiService,
              private currencyService: CurrencyService,
              private luvService: LuvService,
              private brandParamsService: BrandParamsService,
              private cart2Service: Cart2Service,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private cart2BundleService: Cart2BundleService,
              private lightboxesService: LightboxesService,
              private renderer: Renderer2,
              private linesService: LinesService,
              private syndicatesQueryService: SyndicatesQueryService,
              private bundlesService: BundlesService) {
  }

  ngOnInit(): void {
    this.bundle$ = this.bundlesService.getActiveBundlesMap().pluck(this.item.bundleId);
    this.lotteriesMap$ = this.lotteriesService.getLotteriesMap();
    this.upcomingDrawsMap$ = this.drawsService.getUpcomingDrawsMap();
    this.siteCurrencyId$ = this.currencyService.getCurrencyId();
    this.renewPeriods$ = this.offeringsService.getBundleSubscriptionDiscounts(this.item.bundleId);
    this.syndicatesMap$ = this.syndicatesQueryService.getSyndicateModelsMap();

    this.itemPrice$ = combineLatest(
      this.cart2Service.getItem$(this.item.id).distinctUntilChanged((a: CartBundleItemModel, b: CartBundleItemModel) => {
        return (a ? a.renewPeriod : null) === (b ? b.renewPeriod : null);
      }),
      this.bundle$,
      this.siteCurrencyId$,
    )
      .debounceTime(500)
      .switchMap(([item, bundle, currencyId]) => {
        return this.offeringsApiService.getTotalPrice(
          this.brandParamsService.getBrandId(),
          currencyId,
          [],
          [],
          [(item as CartBundleItemModel).getBundleObject()]
        )
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

  onRenewPeriodChangeEvent({item, value}: { item: CartBundleItemModel, value: string | null }): void {
    this.cart2BundleService.changeRenewPeriod(item.id, value);
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

  onEditLineEvent({item, editedLine}: { item: CartBundleItemModel, editedLine: LineInterface }): void {
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
              handler: (payload: { item: CartItemModel, editedLine: LineInterface }) => {
                this.onSaveEditLine(payload.item, payload.editedLine);
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

  onSaveEditLine(item: CartItemModel, editedLine: LineInterface): void {
    this.renderer.removeClass(document.body, 'fixed');

    editedLine = this.linesService.autoselect(editedLine, false);
    this.cart2BundleService.updateLine(item.id, editedLine);

    this.analyticsDeprecatedService.trackCartEditLineSaveClick();
  }

  onCloseEditLine(): void {
    this.renderer.removeClass(document.body, 'fixed');
  }
}
