import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { OfferingsService } from '../../../../services/offerings/offerings.service';
import { DrawsService } from '../../../../services/lotteries/draws.service';
import { Cart2LotteryService } from '../../../../services/cart2/cart2-lottery.service';
import { Cart2Service } from '../../../../services/cart2/cart2.service';

import { Router } from '@angular/router';
import { DeviceService } from '../../../../services/device/device.service';
import { DeviceType } from '../../../../services/device/entities/types/device.type';
import { AnalyticsDeprecatedService } from '../../../analytics-deprecated/services/analytics-deprecated.service';
import { DrawInterface } from '../../../api/entities/incoming/lotteries/draws.interface';
import { OfferingsPricesMapInterface } from '../../../api/entities/incoming/offerings/offerings-prices.interface';
import { LotteryInterface } from '../../../api/entities/incoming/lotteries/lotteries.interface';
import { OfferFreeLinesInterface } from '../../../api/entities/incoming/offerings/offerings-offers.interface';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
  selector: 'app-offers-menu-list-item-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
		<app-offers-menu-list-item
			*ngIf="(lottery$|async) && (upcomingDraw$|async) && ((device$|async) === 'desktop')"
			[lottery]="lottery$|async"
			[upcomingDraw]="upcomingDraw$|async"
			[offeringsPricesMap]="offeringsPricesMap$|async"
			[lineToQualify]="lineToQualify"
			[linesFree]="linesFree"
			[linesAmount]="linesAmount"
			[ribbonText]="ribbonText"
			[isShowRibbon]="isShowRibbon"
			[freeLineClass]="freeLineClass"
			[lotterySlug]="lotterySlug$ | async"
      (addToCartEvent)="addToCartEvent($event)"
			(oTrackMegaMenuClicked)="oTrackMegaMenuClicked($event)"
		></app-offers-menu-list-item>
    <app-offers-menu-list-item-mobile
      *ngIf="(lottery$|async) && ((device$|async) === 'mobile')"
      [lottery]="lottery$|async"
			[lineToQualify]="lineToQualify"
			[linesFree]="linesFree"
			[lotterySlug]="lotterySlug$ | async"
      (addToCartEvent)="addToCartEvent($event)"
			(oTrackMegaMenuClicked)="oTrackMegaMenuClicked($event)"
    ></app-offers-menu-list-item-mobile>
  `
})
export class OffersMenuListItemContainerComponent implements OnInit, OnDestroy {
  @Input() lotteryId: string;

  lottery$: Observable<LotteryInterface>;
  freeLineOffer$: Observable<OfferFreeLinesInterface | null>;
  upcomingDraw$: Observable<DrawInterface>;
  device$: Observable<DeviceType>;
  offeringsPricesMap$: Observable<OfferingsPricesMapInterface>;
  lotterySlug$: Observable<string>;

  aliveSubscriptions = true;
  lineToQualify: number;
  linesFree: number;
  linesAmount: number;
  ribbonText: string;
  isShowRibbon: boolean;
  freeLineClass: string;

  constructor(private lotteriesService: LotteriesService,
              private offeringsService: OfferingsService,
              private drawsService: DrawsService,
              private cart2Service: Cart2Service,
              private cart2LotteryService: Cart2LotteryService,
              private router: Router,
              private deviceService: DeviceService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService) {
  }

  ngOnInit() {
    this.device$ = this.deviceService.getDevice();
    this.lottery$ = this.lotteriesService.getLottery(this.lotteryId);
    this.freeLineOffer$ = this.offeringsService.getLotteryFreeLinesOffer(this.lotteryId);
    this.upcomingDraw$ = this.drawsService.getUpcomingDraw(this.lotteryId);
    this.offeringsPricesMap$ = this.offeringsService.getPrices();
    this.lotterySlug$ = this.lotteriesService.getSlug(this.lotteryId);

    this.getFreeLineOfferProperties();
  }

  addToCartEvent([lotteryId, linesAmount]): void {
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
    this.freeLineOffer$
      .takeWhile(() => this.aliveSubscriptions)
      .subscribe(data => {
        if (data !== null) {
          this.lineToQualify = data.details.lines_to_qualify;
          this.linesFree = data.details.lines_free;
          this.linesAmount = data.details.lines_to_qualify;
          this.isShowRibbon = data.display_properties.ribbon_lotteries_page;
          this.ribbonText = data.display_properties.short_text;
          this.freeLineClass = data.display_properties.ribbon_css_class;
        }
      });
  }

  oTrackMegaMenuClicked(lotteryName: string) {
    this.analyticsDeprecatedService.trackMegaMenuClicked('offers', lotteryName);
  }

  ngOnDestroy(): void {
    this.aliveSubscriptions = false;
  }

}
