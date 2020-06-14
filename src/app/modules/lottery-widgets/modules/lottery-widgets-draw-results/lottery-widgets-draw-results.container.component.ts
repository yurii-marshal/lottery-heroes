import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Data } from '@angular/router';

import { DrawsService } from '../../../../services/lotteries/draws.service';
import { BrandQueryService } from 'app/upgraded/libs/biglotteryowin-core/services/queries/brand-query.service';
import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { switchMap } from 'rxjs/operators';
import { DrawInterface } from '../../../api/entities/incoming/lotteries/draws.interface';
import { LotteryInterface } from '../../../api/entities/incoming/lotteries/lotteries.interface';

@Component({
  selector: 'app-lottery-widgets-draw-results-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-lottery-widgets-draw-results
      [lastDraws]="lastDraws$|async"
      [lottery]="lottery$ | async"
    ></app-lottery-widgets-draw-results>
  `,
})
export class LotteryWidgetsDrawResultsContainerComponent implements OnInit {
  lastDraws$: Observable<DrawInterface[]>;
  lottery$: Observable<LotteryInterface>;

  constructor(private activatedRoute: ActivatedRoute,
              private brandQueryService: BrandQueryService,
              private drawsService: DrawsService,
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
      }).publishReplay(1).refCount();
    this.lastDraws$ = lotteryId$.switchMap((lotteryId: string) => this.drawsService.getLastLotteryDraws(lotteryId));
    this.lottery$ = lotteryId$
      .pipe(
        switchMap((lotteryId: string) => this.lotteriesService.getLottery(lotteryId))
      );
  }
}
