import {
  Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit,
  ViewChildren, QueryList, Renderer2, Inject, PLATFORM_ID, OnDestroy, NgZone, OnChanges, SimpleChanges
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs/Observable';

import { ArraysUtil } from '../../../../../../modules/shared/utils/arrays.util';

import { TicketDesktopComponent } from '../ticket-desktop/ticket-desktop.component';
import { TicketFreeDesktopComponent } from '../ticket-free-desktop/ticket-free-desktop.component';
import { LuckyNumbersItemInterface } from '../../../../../../services/api/entities/incoming/lotteries/lucky-numbers.interface';
import {
  OfferingsSubscriptionDiscountInterface
} from '../../../../../../modules/api/entities/incoming/offerings/offerings-subscription-discounts.interface';
import { LotteryInterface, LotteryRulesInterface } from '../../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../../../../modules/api/entities/incoming/lotteries/draws.interface';
import {
  OfferDisplayPropertiesInterface,
  OfferFreeLinesInterface
} from '../../../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import { merge } from 'rxjs/observable/merge';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { LineInterface } from '../../../../../../modules/api/entities/outgoing/common/line.interface';

@Component({
  selector: 'app-tickets-desktop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tickets-desktop.component.html',
  styleUrls: ['./tickets-desktop.component.scss'],
})
export class TicketsDesktopComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() lotteryId$: Observable<string>;
  @Input() device$: Observable<string>;

  // Tickets
  @Input() rules: LotteryRulesInterface;
  @Input() lines: Array<LineInterface>;
  @Input() luckyNumbers: Array<LuckyNumbersItemInterface>;
  @Input() openedFreeLineIds: Array<string>;
  @Input() autoselectAnimateCommand$: Observable<LineInterface[]>;
  @Input() autoselectAnimateIterations: number;
  @Input() autoselectIterationTime: number;

  // Tickets events
  @Output() autoselectAllEvent = new EventEmitter<{lines: Array<LineInterface>, rules: LotteryRulesInterface}>();
  @Output() clearAllEvent = new EventEmitter<{lines: Array<LineInterface>}>();
  @Output() addLinesEvent = new EventEmitter<void>();
  @Output() pickLuckyNumbersEvent = new EventEmitter();

  // Ticket events
  @Output() autoselectLineEvent = new EventEmitter<{line: LineInterface, rules: LotteryRulesInterface, track: boolean}>();
  @Output() clearLineEvent = new EventEmitter<{line: LineInterface}>();
  @Output() toggleMainEvent = new EventEmitter<{line: LineInterface, rules: LotteryRulesInterface, value: number}>();
  @Output() toggleExtraEvent = new EventEmitter<{line: LineInterface, rules: LotteryRulesInterface, value: number}>();
  @Output() togglePerTicketNumbers = new EventEmitter<{rules: LotteryRulesInterface, value: number}>();
  @Output() autoselectForFreeLineIdEvent = new EventEmitter<string>();
  @Output() changeStatusLuckyNumbersEvent = new EventEmitter<{lotteryId: string, lineId: string, isChecked: boolean}>();

  // Aside
  @Input() freeLinesOfferDisplayProperties: OfferDisplayPropertiesInterface;
  @Input() freeLinesOffer: OfferFreeLinesInterface;
  @Input() lottery: LotteryInterface;
  @Input() upcomingDraw: DrawInterface;
  @Input() priceTotal: number;
  @Input() discountTotal: number;
  @Input() priceOriginal: number;
  @Input() siteCurrencyId: string;
  @Input() renewPeriods: Array<OfferingsSubscriptionDiscountInterface>;
  @Input() selectedRenewPeriod: string | null;

  // Aside events
  @Output() changeRenewPeriodEvent = new EventEmitter<{label: string, value: string | null}>();
  @Output() saveToCartEvent = new EventEmitter();
  @Output() addToCartFromRibbonEvent = new EventEmitter<any>();

  // Login
  @Input() isLoggedIn: boolean;

  @Input() perTicketNumbers: Array<number>;

  // CMS
  @Input() cms: any;

  @ViewChild(TicketDesktopComponent, {read: ElementRef}) nonFreeTicket: ElementRef;
  @ViewChildren(TicketFreeDesktopComponent, {read: ElementRef}) freeTickets: QueryList<ElementRef>;

  showCmsBasedLotteryInfo = false;

  private aliveSubscriptions = true;

  constructor(private renderer: Renderer2,
              private zone: NgZone,
              @Inject(PLATFORM_ID) private platformId: Object) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cms && changes.cms.currentValue) {
      this.showCmsBasedLotteryInfo = this.isShowCmsBasedLotteryInfo();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      merge(
        this.addLinesEvent,
        fromEvent(window, 'resize')
      )
        .takeWhile(() => this.aliveSubscriptions)
        .subscribe(() => this.setEqualTicketsHeight());

      this.setEqualTicketsHeight();
    }
  }

  private setEqualTicketsHeight(): void {
    if (typeof this.nonFreeTicket !== 'undefined') {
      this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          this.zone.run(() => {
            const nonFreeTicketHeight = this.nonFreeTicket.nativeElement.querySelector('.line').offsetHeight + 'px';

            this.freeTickets.forEach((freeTicket: ElementRef) => {
              this.renderer.setStyle(freeTicket.nativeElement.querySelector('.free-line-wrapper'), 'height', nonFreeTicketHeight);
            });
          });
        }, 0);
      });
    }
  }

  isOpenedFreeLine(lineId: string): boolean {
    return ArraysUtil.inArray(this.openedFreeLineIds, lineId);
  }

  getAutoselectAnimateLineCommand$(lineId: string): Observable<LineInterface> {
    return this.autoselectAnimateCommand$
      .map((lines: Array<LineInterface>) => {
        return lines.filter(line => line.id === lineId)[0];
      })
      .filter(line => typeof line !== 'undefined');
  }

  trackByLineId(index: number, line: LineInterface): any {
    return line.id;
  }

  ngOnDestroy(): void {
    this.aliveSubscriptions = false;
  }

  private isCmsDataForBox1(): boolean {
    return this.cms.box1_icon || this.cms.box1_title || this.cms.box1_summary || this.cms.box1_link_text || this.cms.box1_link_url;
  }

  private isCmsDataForBox2(): boolean {
    return this.cms.box2_icon || this.cms.box2_title || this.cms.box2_summary || this.cms.box2_link_text || this.cms.box2_link_url;
  }

  private isCmsDataForBox3(): boolean {
    return this.cms.box3_icon || this.cms.box3_title || this.cms.box3_summary || this.cms.box3_link_text || this.cms.box3_link_url;
  }

  private isShowCmsBasedLotteryInfo(): boolean {
    return this.isCmsDataForBox1() || this.isCmsDataForBox2() || this.isCmsDataForBox3() || this.cms.bottom_area;
  }
}
