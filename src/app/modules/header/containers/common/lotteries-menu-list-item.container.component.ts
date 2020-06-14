import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { DeviceService } from '../../../../services/device/device.service';
import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { DrawsService } from '../../../../services/lotteries/draws.service';

import { DeviceType } from '../../../../services/device/entities/types/device.type';
import { CurrencyService } from '../../../../services/auth/currency.service';
import { OfferingsService } from '../../../../services/offerings/offerings.service';
import { Cart2Service } from '../../../../services/cart2/cart2.service';
import { Cart2LotteryService } from '../../../../services/cart2/cart2-lottery.service';
import { AnalyticsDeprecatedService } from '../../../analytics-deprecated/services/analytics-deprecated.service';
import { OfferingsPricesMapInterface } from '../../../api/entities/incoming/offerings/offerings-prices.interface';
import { LotteryInterface } from '../../../api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../api/entities/incoming/lotteries/draws.interface';
import { OfferFreeLinesInterface } from '../../../api/entities/incoming/offerings/offerings-offers.interface';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../store/reducers';
import * as headerActions from '../../actions/header.actions';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
  selector: 'app-lotteries-menu-list-item-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="(lottery$|async) && upcomingDraw$|async">
      <app-lotteries-menu-list-item
        class="hidden-sm-down"
        [lottery]="lottery$|async"
        [upcomingDraw]="upcomingDraw$|async"
        [siteCurrencySymbol]="siteCurrencySymbol$|async"
				[offeringsPricesMap]="offeringsPricesMap$|async"
				[lineToQualify]="lineToQualify"
				[linesFree]="linesFree"
				[linesAmount]="linesAmount"
				[ribbonText]="ribbonText"
				[isShowRibbon]="isShowRibbon"
				[freeLineClass]="freeLineClass"
				[isFreeLine]="isFreeLine"
				[lotterySlug]="lotterySlug$ | async"
        (addToCartEvent)="onAddToCartEvent($event)"
				(oTrackMegaMenuClicked)="oTrackMegaMenuClicked($event)"
        (oTrackHandPickNumbersClicked)="oTrackHandPickNumbersClicked($event)"
      ></app-lotteries-menu-list-item>
      <app-lotteries-menu-list-item-mobile
        class="hidden-md-up"
        [lottery]="lottery$|async"
        [upcomingDraw]="upcomingDraw$|async"
				[lotterySlug]="lotterySlug$ | async"
      ></app-lotteries-menu-list-item-mobile>
    </ng-container>
  `
})
export class LotteriesMenuListItemContainerComponent implements OnInit, OnDestroy {
  @Input() lotteryId: string;

  device$: Observable<DeviceType>;
  lottery$: Observable<LotteryInterface>;
  upcomingDraw$: Observable<DrawInterface>;
  siteCurrencySymbol$: Observable<string>;
  freeLineOffer$: Observable<OfferFreeLinesInterface | null>;
  offeringsPricesMap$: Observable<OfferingsPricesMapInterface>;
  lotterySlug$: Observable<string>;

  aliveSubscriptions = true;
  isFreeLine: boolean;
  lineToQualify: number;
  linesFree: number;
  linesAmount: number;
  ribbonText: string;
  isShowRibbon: boolean;
  freeLineClass: string;

  constructor(private deviceService: DeviceService,
              private lotteriesService: LotteriesService,
              private drawsService: DrawsService,
              private currencyService: CurrencyService,
              private offeringsService: OfferingsService,
              private cart2Service: Cart2Service,
              private cart2LotteryService: Cart2LotteryService,
              private router: Router,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.device$ = this.deviceService.getDevice();
    this.lottery$ = this.lotteriesService.getLottery(this.lotteryId);
    this.upcomingDraw$ = this.drawsService.getUpcomingDraw(this.lotteryId);
    this.siteCurrencySymbol$ = this.currencyService.getCurrencySymbol();
    this.freeLineOffer$ = this.offeringsService.getLotteryFreeLinesOffer(this.lotteryId);
    this.offeringsPricesMap$ = this.offeringsService.getPrices();
    this.lotterySlug$ = this.lotteriesService.getSlug(this.lotteryId);

    this.getFreeLineOfferProperties();
  }

  onAddToCartEvent([lotteryId, linesAmount]): void {
    combineLatest(
      this.lotteriesService.getLottery(lotteryId),
      this.cart2Service.getItems$(),
    )
      .first()
      .takeWhile(() => this.aliveSubscriptions)
      .subscribe(([lottery, items]) => {
        const item = this.cart2LotteryService.createMinLotteryItem(lottery, items, true, linesAmount);
        this.cart2LotteryService.addItems([item]);
        this.router.navigate(['/cart']);
      });
  }

  getFreeLineOfferProperties() {
    this.freeLineOffer$.subscribe(data => {
      if (data !== null) {
        this.isFreeLine = true;
        this.lineToQualify = data.details.lines_to_qualify;
        this.linesFree = data.details.lines_free;
        this.linesAmount = data.details.lines_to_qualify;
        this.isShowRibbon = data.display_properties.ribbon_lotteries_page;
        this.ribbonText = data.display_properties.short_text;
        this.freeLineClass = data.display_properties.ribbon_css_class;
      } else {
        this.linesAmount = 4;
      }
    });
  }

  oTrackMegaMenuClicked(lotteryName: string) {
    this.analyticsDeprecatedService.trackMegaMenuClicked('lotteries', lotteryName);
  }

  oTrackHandPickNumbersClicked(lotteryName) {
    this.store.dispatch(new headerActions.ClickHandPickNumbers({ lotteryName, menuName: 'lotteries' }));
  }

  ngOnDestroy(): void {
    this.aliveSubscriptions = false;
  }
}
