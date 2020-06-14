import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DrawInterface } from '../api/entities/incoming/lotteries/draws.interface';
import { LotteryInterface } from '../api/entities/incoming/lotteries/lotteries.interface';
import { DrawsService } from '../../services/lotteries/draws.service';
import { LotteriesService } from '../../services/lotteries/lotteries.service';
import { CmsService } from '../cms/services/cms.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-lottery-info-cms-based-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-lottery-info-cms-based
      *ngIf="isShown"
      [lottery]="lottery$ | async"
      [lotterySlug]="lotterySlug$ | async"
      [lotteryLatestDraw]="lotteryLatestDraw$ | async"
      [cms]="cms$ | async"
      [showBox1]="showBox1"
      [showBox2]="showBox2"
      [showBox3]="showBox3"
    ></app-lottery-info-cms-based>
  `
})
export class LotteryInfoCmsBasedContainerComponent implements OnInit {
  @Input() lotteryId: string;

  lotterySlug$: Observable<string>;
  cms$: Observable<any>;
  lotteryLatestDraw$: Observable<DrawInterface>;
  lottery$: Observable<LotteryInterface>;

  isShown = false;
  isInited = false;
  showBox1 = false;
  showBox2 = false;
  showBox3 = false;

  constructor(private cmsService: CmsService,
              private drawsService: DrawsService,
              private lotteriesService: LotteriesService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.lotterySlug$ = this.lotteriesService.getSlug(this.lotteryId).publishReplay(1).refCount();
    this.cms$ = this.lotterySlug$
      .pipe(
        switchMap((slug: string) => this.cmsService.getPageData(slug))
      );
    this.cms$.subscribe(cms => {
      this.showBox1 = this.isCmsDataForBox1(cms);
      this.showBox2 = this.isCmsDataForBox2(cms);
      this.showBox3 = this.isCmsDataForBox3(cms);
      this.isShown = this.isShowCmsBasedLotteryInfo(cms);
      this.isInited = true;
      this.changeDetectorRef.markForCheck();
    });

    this.lotteryLatestDraw$ = this.drawsService.getLatestDraw(this.lotteryId);
    this.lottery$ = this.lotteriesService.getLottery(this.lotteryId);
  }

  private isCmsDataForBox1(cms): boolean {
    return !!(cms.box1_icon || cms.box1_title || cms.box1_summary || cms.box1_link_text || cms.box1_link_url);
  }

  private isCmsDataForBox2(cms): boolean {
    return !!(cms.box2_icon || cms.box2_title || cms.box2_summary || cms.box2_link_text || cms.box2_link_url);
  }

  private isCmsDataForBox3(cms): boolean {
    return !!(cms.box3_icon || cms.box3_title || cms.box3_summary || cms.box3_link_text || cms.box3_link_url);
  }

  private isShowCmsBasedLotteryInfo(cms): boolean {
    return this.isCmsDataForBox1(cms) || this.isCmsDataForBox2(cms) || this.isCmsDataForBox3(cms) || !!cms.bottom_area;
  }
}
