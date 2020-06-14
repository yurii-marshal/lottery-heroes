import { Component, ChangeDetectionStrategy, OnDestroy, Inject, PLATFORM_ID, Input, ViewEncapsulation } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { CustomerInterface } from '../../../../../services/auth/entities/interfaces/customer.interface';
import { Observable } from 'rxjs/Observable';
import { LotteriesMapInterface } from '../../../../../services/lotteries/entities/interfaces/lotteries-map.interface';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../../store/reducers/index';
import { LineInterface } from '../../../../../modules/api/entities/outgoing/common/line.interface';
import { LoadScripts } from '../../../../../modules/shared/utils/load-scripts.utils';

@Component({
  selector: 'app-list-of-options',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './list-of-options.component.html',
  styleUrls: ['./list-of-options.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListOfOptionsComponent implements OnDestroy {

  @Input() customer: CustomerInterface;

  private swiper: any;
  lotteriesMap$: Observable<LotteriesMapInterface>;
  isShownSubscriptionWidget$: Observable<boolean>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private store: Store<fromRoot.State>) {

    const lastOrderLines$ = this.store.select(fromRoot.getCartLastOrdered)
      .filter(order => order !== null)
      .map(order => order.lines);

    this.isShownSubscriptionWidget$ = lastOrderLines$
      .map((lines: Array<LineInterface>) => lines.length > 0)
      .do(() => {
        if (isPlatformBrowser(this.platformId)) {
          this.initSwiper();
        }
      });
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
      loop: false,
      initialSlide: 0,
      spaceBetween: 10,
      slidesPerGroup: 1,
      slidesPerView: 2,
      breakpoints: {
        990: {
          slidesPerView: 1,
        }
      },
      pagination: '.swiper-pagination',
      paginationClickable: true,
      observer: true
    });
  }

  ngOnDestroy(): void {
    if (typeof this.swiper === 'undefined') {
      return;
    }

    typeof this.swiper.length === 'undefined'
      ? this.swiper.destroy()
      : this.swiper.forEach(data => data.destroy());
  }
}
