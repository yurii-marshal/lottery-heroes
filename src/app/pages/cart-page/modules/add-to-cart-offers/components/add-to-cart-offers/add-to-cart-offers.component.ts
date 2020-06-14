import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input, NgZone,
  OnChanges,
  OnDestroy,
  Output,
  PLATFORM_ID,
  SimpleChanges
} from '@angular/core';
import { AnalyticsDeprecatedService } from '../../../../../../modules/analytics-deprecated/services/analytics-deprecated.service';
import { isPlatformBrowser } from '@angular/common';
import { DrawsService } from '../../../../../../services/lotteries/draws.service';
import { LoadScripts } from '../../../../../../modules/shared/utils/load-scripts.utils';
import { AddToCartOffersModel } from '../../models/add-to-cart-offers.model';

@Component({
  selector: 'app-add-to-cart-offers',
  templateUrl: './add-to-cart-offers.component.html',
  styleUrls: ['./add-to-cart-offers.component.scss']
})
export class AddToCartOffersComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() addToCartOffersModelList: Array<AddToCartOffersModel>;

  @Output() addToCartEvent = new EventEmitter<string>();
  @Output() addToCartFromRibbonEvent = new EventEmitter<any>();
  @Output() addToCartSyndicateEvent = new EventEmitter<{templateId: number, lotteryId: string}>();

  private aliveSubscriptions = true;
  private swiper: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private drawsService: DrawsService,
              private zone: NgZone) {
  }

  ngAfterViewInit() {
    this.drawsService.getUpcomingDrawsList()
      .delay(1000)
      .skip(1)
      .takeWhile(() => this.aliveSubscriptions)
      .subscribe(() => {
        if (this.swiper) {
          this.swiper.update();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['addToCartOffersModelList'] && changes['addToCartOffersModelList'].currentValue) {
      const lotteryIds = this.addToCartOffersModelList.map((model: AddToCartOffersModel) => model.lotteryId);
      this.analyticsDeprecatedService.trackListImpressions(lotteryIds, 'cartOffersCarousel');

      if (isPlatformBrowser(this.platformId)) {
        if (this.swiper) {
          setTimeout(() => {
            this.zone.run(() => this.swiper.update());
          }, 0);
        } else {
          this.initSwiper();
        }
      }
    }
  }

  private initSwiper() {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof(Swiper) === 'undefined') {
        LoadScripts.append('swiper.bundle.js', () => this.createSwiper());
      } else {
        this.createSwiper();
      }
    }
  }

  private createSwiper() {
    // http://idangero.us/swiper
    this.swiper = new Swiper('.swiper-container-offers', {
      // Optional parameters
      loop: false,
      initialSlide: 0,
      spaceBetween: 10,
      slidesPerGroup: 1,
      slidesPerView: 3,
      simulateTouch: false,
      breakpoints: {
        // when window width is <= 992px
        992: {
          slidesPerView: 2,
        },
        767: {
          slidesPerView: 1,
          simulateTouch: true
        },
      },

      // Navigation arrows
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
    });
  }

  onTrackSpin(direction: string) {
    this.analyticsDeprecatedService.trackCarouselSpin(direction);
  }

  ngOnDestroy(): void {
    this.aliveSubscriptions = false;

    if (this.swiper) {
      typeof this.swiper.length === 'undefined'
        ? this.swiper.destroy()
        : this.swiper.forEach(data => data.destroy());
    }
  }
}
