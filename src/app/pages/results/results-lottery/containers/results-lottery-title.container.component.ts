import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { MetaService } from '../../../../modules/meta/services/meta.service';
import { LotteryInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { BrandQueryService } from '@libs/biglotteryowin-core/services/queries/brand-query.service';

@Component({
  selector: 'app-results-lottery-title-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-results-lottery-title
      [lottery]="lottery$|async"
    ></app-results-lottery-title>
  `,
})
export class ResultsLotteryTitleContainerComponent implements OnInit, OnDestroy {
  lottery$: Observable<LotteryInterface>;

  private subscriptions: Array<Subscription> = [];

  constructor(private activatedRoute: ActivatedRoute,
              private lotteriesService: LotteriesService,
              private brandQueryService: BrandQueryService,
              private metaService: MetaService) {
  }

  ngOnInit(): void {
    const lotteryId$ = this.activatedRoute.data
      .map((data: Data) => data['lotteryId'])
      .map((lotteryId: string) => {
        if (lotteryId === 'euromillions' && this.brandQueryService.getBrandId() !== 'BIGLOTTERYOWIN_UK') {
          return 'euromillions-ie';
        }

        return lotteryId;
      });
    this.lottery$ = lotteryId$.switchMap((lotteryId: string) => this.lotteriesService.getLottery(lotteryId));

    this.subscriptions.push(lotteryId$.subscribe((lotteryId: string) => {
      this.metaService.setFromConfig('results', lotteryId);
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
