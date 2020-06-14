import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LotteryInterface } from '../api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../api/entities/incoming/lotteries/draws.interface';
import { LotteriesService } from '../../services/lotteries/lotteries.service';
import { DrawsService } from '../../services/lotteries/draws.service';
import { DeviceType } from '../../services/device/entities/types/device.type';
import { DeviceService } from '../../services/device/device.service';
import { LuvCountryInterface } from '../../services/api/entities/incoming/luv/luv-countries.interface';
import { LuvService } from '../../services/luv.service';
import { of } from 'rxjs/observable/of';
import { BrandParamsService } from '../brand/services/brand-params.service';
import { BallCombinationsMapInterface } from '../../services/api/entities/incoming/lotteries/ball-combinations-map.interface';
import { AnalyticsDeprecatedService } from '../analytics-deprecated/services/analytics-deprecated.service';
import { WordpressService } from '../../services/wordpress/wordpress.service';

@Component({
  selector: 'app-lottery-info-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-lottery-info
      [lottery]="lottery$|async"
      [lottery$]="lottery$"
      [lotterySlug]="lotterySlug$ | async"
      [lotteryLatestDraw]="lotteryLatestDraw$|async"
			[upcomingDraw]="upcomingDraw$|async"
      [lotteryCountryName]="lotteryCountryName$|async"
      [lotteryJackpotOdds]="lotteryJackpotOdds$|async"
      [lotteryWordpressPosts$]="lotteryWordpressPosts$"
      [device]="device$|async"

      (changeTabEvent)="onChangeTabEvent($event)"
    ></app-lottery-info>
  `,
})
export class LotteryInfoContainerComponent implements OnInit, OnDestroy {
  @Input() lotteryId: string;

  lotterySlug$: Observable<string>;
  device$: Observable<DeviceType>;
  lottery$: Observable<LotteryInterface>;
  lotteryLatestDraw$: Observable<DrawInterface>;
  lotteryCountryName$: Observable<string>;
  lotteryJackpotOdds$: Observable<number>;
  lotteryWordpressPosts$: Observable<any[]>;
  upcomingDraw$: Observable<DrawInterface>;

  private aliveSubscriptions = true;

  constructor(private lotteriesService: LotteriesService,
              private brandParamsService: BrandParamsService,
              private luvService: LuvService,
              private deviceService: DeviceService,
              private drawsService: DrawsService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private wordpressService: WordpressService) {
  }

  ngOnInit() {
    this.lotterySlug$ = this.lotteriesService.getSlug(this.lotteryId);

    this.device$ = this.deviceService.getDevice();
    this.lottery$ = this.lotteriesService.getLottery(this.lotteryId);
    this.lotteryLatestDraw$ = this.drawsService.getLatestDraw(this.lotteryId);
    this.upcomingDraw$ = this.drawsService.getUpcomingDraw(this.lotteryId);

    this.lotteryCountryName$ = this.lottery$
      .switchMap((lottery: LotteryInterface) => this.getCountryName$(lottery));

    this.lotteryJackpotOdds$ = this.lottery$
      .map((lottery: LotteryInterface) => this.getJackpotOdds(lottery.odds));
  }

  private getCountryName$(lottery: LotteryInterface): Observable<string> {
    const currentBrandId = this.brandParamsService.getBrandId();
    let countryName = '';
    lottery.brands.forEach(brand => {
      if (brand.id === currentBrandId) {
        countryName = brand.custom_country;
      }
    });
    if (countryName !== null && countryName !== '') {
      return of(countryName);
    }
    return this.luvService.getCountries()
      .filter(countries => countries.length > 0)
      .map((countries: Array<LuvCountryInterface>) => LuvService.findCountryNameInCountries(countries, lottery.country_id));
  }

  getJackpotOdds(odds: BallCombinationsMapInterface): number {
    return this.lotteriesService.parseBallCombinationsMap(odds, 'valDesc')[0].val;
  }

  getLotteryWordpressPosts$(lotteryId: string): Observable<any[]> {
    const niceTagsForPosts = {
      'el-gordo-primitiva': 'el-gordo',
      'lotto-6aus49': '6aus49',
      'oz-lotto-au': 'lotto-au'
    };

    const tag = (lotteryId in niceTagsForPosts) ? niceTagsForPosts[lotteryId] : lotteryId;

    return this.wordpressService.getLotteryPosts(tag)
      .map(res => res.map(post => {
        post.title.rendered = post.title.rendered.replace('&#8217;', '\'');
        post.excerpt.rendered = post.excerpt.rendered.replace('[&hellip;]', '...');
        post['postImgLink$'] = this.wordpressService.getPostImg(post.featured_media);
        return post;
      }).slice(0, 5));
  }

  trackLotteryMoreInfoClick(tabTitle: string): void {
    this.analyticsDeprecatedService.trackLotteryMoreInfoClick(tabTitle);
  }

  onChangeTabEvent(tabTitle: string): void {
    if (tabTitle === 'News') {
      this.lotteryWordpressPosts$ = this.getLotteryWordpressPosts$(this.lotteryId);
    }

    this.trackLotteryMoreInfoClick(tabTitle);
  }

  ngOnDestroy(): void {
    this.aliveSubscriptions = false;
  }
}
