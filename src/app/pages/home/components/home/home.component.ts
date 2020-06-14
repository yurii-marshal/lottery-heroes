import {
  Component, ChangeDetectionStrategy, OnInit, PLATFORM_ID, Inject, OnDestroy
} from '@angular/core';

import { MetaService } from '../../../../modules/meta/services/meta.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AnalyticsDeprecatedService } from '../../../../modules/analytics-deprecated/services/analytics-deprecated.service';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { ScrollService } from '../../../../services/device/scroll.service';
import { BrandParamsService } from '../../../../modules/brand/services/brand-params.service';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  mainJackpotLotterySubject$: BehaviorSubject<string>;
  windowScrollSubscription: Subscription;
  brandId: string;

  constructor(private metaService: MetaService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private scrollService: ScrollService,
              private brandParamsService: BrandParamsService,
              @Inject(PLATFORM_ID) private platformId: Object) {
    this.mainJackpotLotterySubject$ = new BehaviorSubject(null);

    if (isPlatformBrowser(this.platformId)) {
      this.windowScrollSubscription = scrollService.getScrollDirection()
        .debounceTime(200)
        .subscribe((label: string) => {
          this.analyticsDeprecatedService.trackScrollCart(label);
        });
    }
  }

  ngOnInit(): void {
    this.metaService.setFromConfig('page', 'home');
    this.brandId = this.brandParamsService.getBrandId();
  }

  setMainJackpotLottery(lottery) {
    this.mainJackpotLotterySubject$.next(lottery);
  }

  ngOnDestroy() {
    if (this.windowScrollSubscription) {
      this.windowScrollSubscription.unsubscribe();
    }
  }

}
