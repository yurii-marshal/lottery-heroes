import { Component, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Data } from '@angular/router';

import { DrawsService } from '../../../services/lotteries/draws.service';
import { LotteriesService } from '../../../services/lotteries/lotteries.service';

import { DrawInterface } from '../../api/entities/incoming/lotteries/draws.interface';
import { LotteryInterface } from '../../api/entities/incoming/lotteries/lotteries.interface';
import { BrandQueryService } from '@libs/biglotteryowin-core/services/queries/brand-query.service';
import { LotteriesMapInterface } from '../../../services/lotteries/entities/interfaces/lotteries-map.interface';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';
import { first, map, switchMap } from 'rxjs/operators';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
  selector: 'app-lottery-widgets-next-draw-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-lottery-widgets-next-draw
      [upcomingDraw]="upcomingDraw$ | async"
      [lottery]="lottery$ | async"
      [isInAside]="isInAside"
      [isSold]="isSold$ | async"
      [syndicate]="syndicate$ | async"
    ></app-lottery-widgets-next-draw>
  `,
})
export class LotteryWidgetsNextDrawContainerComponent implements OnInit {
  @Input() isInAside: boolean;

  upcomingDraw$: Observable<DrawInterface>;
  lottery$: Observable<LotteryInterface>;
  isSold$: Observable<boolean>;
  syndicate$: Observable<SyndicateModel>;

  constructor(private activatedRoute: ActivatedRoute,
              private drawsService: DrawsService,
              private lotteriesService: LotteriesService,
              private brandQueryService: BrandQueryService,
              private syndicatesQueryService: SyndicatesQueryService) {
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
    this.lottery$ = lotteryId$.switchMap((lotteryId: string) => this.lotteriesService.getLottery(lotteryId));
    this.upcomingDraw$ = lotteryId$.switchMap((lotteryId: string) => this.drawsService.getUpcomingDraw(lotteryId));

    this.isSold$ = combineLatest(
      lotteryId$,
      this.lotteriesService.getSoldLotteriesMap()
    )
      .pipe(
        first(),
        map(([lotteryId, soldLotteriesMap]: [string, LotteriesMapInterface]) => !!soldLotteriesMap[lotteryId])
      );
    this.syndicate$ = lotteryId$
      .pipe(
        switchMap((lotteryId: string) => this.syndicatesQueryService.getSyndicateModelByLotteryId(lotteryId))
      );
  }
}
