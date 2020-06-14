import {
  Component, ChangeDetectionStrategy, Input, Output, EventEmitter, AfterViewInit, OnDestroy, ElementRef, Renderer2, Inject, PLATFORM_ID,
  ViewChild, NgZone
} from '@angular/core';

import { ScrollService } from '../../../../../../services/device/scroll.service';

import { isPlatformBrowser } from '@angular/common';
import {
  OfferingsSubscriptionDiscountInterface
} from '../../../../../../modules/api/entities/incoming/offerings/offerings-subscription-discounts.interface';
import { LotteryInterface } from '../../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../../../../modules/api/entities/incoming/lotteries/draws.interface';
import {
  OfferDisplayPropertiesInterface,
  OfferFreeLinesInterface
} from '../../../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';

@Component({
  selector: 'app-tickets-aside-desktop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tickets-aside-desktop.component.html',
  styleUrls: ['./tickets-aside-desktop.component.scss'],
})
export class LotteryAsideDesktopComponent implements AfterViewInit, OnDestroy {
  @Input() freeLinesOfferDisplayProperties: OfferDisplayPropertiesInterface;
  @Input() freeLinesOffer: OfferFreeLinesInterface;
  @Input() lottery: LotteryInterface;
  @Input() upcomingDraw: DrawInterface;
  @Input() openedFreeLinesNumber: number;
  @Input() priceTotal: number;
  @Input() discountTotal: number;
  @Input() priceOriginal: number;
  @Input() siteCurrencyId: string;
  @Input() renewPeriods: Array<OfferingsSubscriptionDiscountInterface>;
  @Input() selectedRenewPeriod: string | null;

  @Output() saveToCartEvent = new EventEmitter();
  @Output() changeRenewPeriodEvent = new EventEmitter<{label: string, value: string | null}>();
  @Output() addToCartFromRibbonEvent = new EventEmitter<any>();

  @ViewChild('banner') banner: ElementRef;
  @ViewChild('asideBody') asideBody: ElementRef;

  private aliveSubscriptions = true;
  private bannerAnimationInterval: any;

  Math: any;

  constructor(private scrollService: ScrollService,
              private el: ElementRef,
              private renderer: Renderer2,
              private zone: NgZone,
              @Inject(PLATFORM_ID) private platformId: Object) {
    this.Math = Math;
  }

  ngAfterViewInit() {
    this.initScroll();
    this.animateBanner();

    if (isPlatformBrowser(this.platformId)) {
      this.asideBody.nativeElement.classList.add('active');
    }
  }

  changeRenewPeriod(label: string, e) {
    if (e.target.checked) {
      this.changeRenewPeriodEvent.emit({label, value: 'P1M'});
    } else {
      this.changeRenewPeriodEvent.emit({label, value: null});
    }
  }

  animateBanner(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.banner) {
      this.zone.runOutsideAngular(() => {
        this.bannerAnimationInterval = setInterval(() => {
          this.zone.run(() => {
            this.banner.nativeElement.classList.add('active');
            this.zone.runOutsideAngular(() => {
              setTimeout(() => {
                this.zone.run(() => {
                  this.banner.nativeElement.classList.remove('active');
                });
              }, 2000);
            });
          });
        }, 5000);
      });
    }
  }

  private initScroll() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const con = this.el.nativeElement.querySelector('.aside-container');
    const bod = this.el.nativeElement.querySelector('.aside-body');

    this.scrollService.getYOffset()
      .takeWhile(() => this.aliveSubscriptions)
      .subscribe(YOffset => {

        const conHeight = con.offsetHeight;
        const bodHeight = bod.offsetHeight;
        const topCon = con.getBoundingClientRect().top; // element coordinates relative to the window
        const conTop = con.getBoundingClientRect().top + YOffset - 100; // element coordinates relative to the document (without - 128)
        const redLine = -(conHeight - bodHeight - conTop);

        if (bodHeight === conHeight) {
          return;
        } else if (topCon < conTop && topCon > redLine) {
          this.renderer.removeClass(bod, 'bottom');
          this.renderer.addClass(bod, 'fixed');
        } else if (topCon < redLine) {
          this.renderer.removeClass(bod, 'fixed');
          this.renderer.addClass(bod, 'bottom');
        } else {
          this.renderer.removeClass(bod, 'bottom');
          this.renderer.removeClass(bod, 'fixed');
        }
      });
  }

  addToCartFromRibbon(event, data) {
    event.preventDefault();
    this.addToCartFromRibbonEvent.emit(data);
  }

  ngOnDestroy() {
    clearInterval(this.bannerAnimationInterval);
    this.aliveSubscriptions = false;
  }
}
