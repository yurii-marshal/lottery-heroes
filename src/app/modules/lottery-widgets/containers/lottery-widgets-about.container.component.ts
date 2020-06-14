import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Data } from '@angular/router';

import { LotteriesService } from '../../../services/lotteries/lotteries.service';
import { LotteryInterface } from '../../api/entities/incoming/lotteries/lotteries.interface';
import { BrandQueryService } from '@libs/biglotteryowin-core/services/queries/brand-query.service';

@Component({
  selector: 'app-lottery-widgets-about-container',
  template: `<app-lottery-widgets-about
              [lottery]="lottery$|async"
            ></app-lottery-widgets-about>`
})
export class LotteryWidgetsAboutContainerComponent implements OnInit {
  lottery$: Observable<LotteryInterface>;

  constructor(private activatedRoute: ActivatedRoute,
              private brandQueryService: BrandQueryService,
              private lotteriesService: LotteriesService) { }

  ngOnInit() {
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
