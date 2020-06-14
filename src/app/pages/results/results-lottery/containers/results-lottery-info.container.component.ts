import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { LotteryInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { BrandQueryService } from '@libs/biglotteryowin-core/services/queries/brand-query.service';

@Component({
  selector: 'app-results-lottery-info-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-results-lottery-info
      [lottery]="lottery$|async"
    ></app-results-lottery-info>
  `,
})
export class ResultsLotteryInfoContainerComponent implements OnInit {
  lottery$: Observable<LotteryInterface>;

  constructor(private activatedRoute: ActivatedRoute,
              private brandQueryService: BrandQueryService,
              private lotteriesService: LotteriesService) {
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
  }
}
