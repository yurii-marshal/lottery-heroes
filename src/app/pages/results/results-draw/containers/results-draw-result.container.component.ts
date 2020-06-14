import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DrawsService } from '../../../../services/lotteries/draws.service';

import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { DrawInterface } from '../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { LotteryInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { BrandQueryService } from '@libs/biglotteryowin-core/services/queries/brand-query.service';

@Component({
  selector: 'app-results-draw-result-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-results-draw-result
      [draw]="draw$|async"
      [lottery]="lottery$|async"
    ></app-results-draw-result>
  `,
})
export class ResultsDrawResultContainerComponent implements OnInit {
  draw$: Observable<DrawInterface>;
  lottery$: Observable<LotteryInterface>;

  constructor(private activatedRoute: ActivatedRoute,
              private drawsService: DrawsService,
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
    const dateLocal$ = this.activatedRoute.params.map((params: Params) => params['dateLocal']);

    this.draw$ = combineLatest(lotteryId$, dateLocal$)
      .switchMap(data => this.drawsService.getDrawByDate(data[0], data[1]));
    this.lottery$ = lotteryId$.switchMap((lotteryId: string) => this.lotteriesService.getLottery(lotteryId));
  }
}
