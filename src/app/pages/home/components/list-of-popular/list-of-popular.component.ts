import {
  Component, ChangeDetectionStrategy, Input, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, Inject, PLATFORM_ID, ViewChild, ElementRef
} from '@angular/core';

import { DrawsService } from '../../../../services/lotteries/draws.service';
import { AnalyticsDeprecatedService } from '../../../../modules/analytics-deprecated/services/analytics-deprecated.service';
import { isPlatformBrowser } from '@angular/common';
import { LoadScripts } from '../../../../modules/shared/utils/load-scripts.utils';

@Component({
  selector: 'app-list-of-popular',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './list-of-popular.component.html',
  styleUrls: ['./list-of-popular.component.scss']
})
export class ListOfPopularComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() lotteryIds: Array<string>;

  private aliveSubscriptions = true;
  private swiper: any;

  @ViewChild('listOfPopular')
  listOfPopular: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private drawsService: DrawsService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService) {
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.listOfPopular.nativeElement.classList.add('show-slider');
    }

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
    if (changes['lotteryIds'] && changes['lotteryIds'].currentValue) {
      this.analyticsDeprecatedService.trackListImpressions(this.lotteryIds, 'homeCarousel');

      if (isPlatformBrowser(this.platformId)) {
        if (this.swiper) {
          this.swiper.update();
        } else {
          setTimeout(() => this.initSwiper(), 0);
        }

        this.lotteryIds = this.lotteryIds ? [
          ...this.lotteryIds,
          ...this.lotteryIds,
          ...this.lotteryIds,
          ...this.lotteryIds,
        ] : [];
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
    this.swiper = new Swiper('.swiper-container', {
      // Optional parameters
      // autoplay: 5000,
      loop: true,
      initialSlide: this.lotteryIds.length / 2,
      spaceBetween: 10,
      slidesPerGroup: 1,
      slidesPerView: 3,
      breakpoints: {
        992: {
          slidesPerView: 2,
        },
        530: {
          slidesPerView: 1,
        }
      },

      // Navigation arrows
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
    });
  }

  onTrackSpin(direction: string) {
    this.analyticsDeprecatedService.trackCarouselSpin(direction);
  }

  onTrackListClicked() {
    this.analyticsDeprecatedService.trackCarouselListClicked();
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
