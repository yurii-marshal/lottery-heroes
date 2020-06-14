import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DrawsService } from '../../../../services/lotteries/draws.service';
import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { DrawInterface } from '../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { LotteryInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { BrandQueryService } from '@libs/biglotteryowin-core/services/queries/brand-query.service';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';
import { switchMap } from 'rxjs/operators';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';

@Component({
  selector: 'app-results-draw-next-draw-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-results-draw-next-draw
      *ngIf="upcomingDraw$|async"
      [upcomingDraw]="upcomingDraw$|async"
      [lottery]="lottery$|async"
      [syndicate]="syndicate$ | async"
    ></app-results-draw-next-draw>
  `,
})


export class ResultsDrawNextDrawContainerComponent implements OnInit {
  upcomingDraw$: Observable<DrawInterface>;
  lottery$: Observable<LotteryInterface>;
  syndicate$: Observable<SyndicateModel>;

  constructor(private activatedRoute: ActivatedRoute,
              private drawsService: DrawsService,
              private brandQueryService: BrandQueryService,
              private lotteriesService: LotteriesService,
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
    this.syndicate$ = lotteryId$
      .pipe(
        switchMap((lotteryId: string) => this.syndicatesQueryService.getSyndicateModelByLotteryId(lotteryId))
      );
  }
}
