import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { LotteriesService } from '../../services/lotteries/lotteries.service';
import { SegmentationIdsInterface } from '../../services/lotteries/entities/interfaces/segmentation.interface';
import { LotteriesMapInterface } from '../../services/lotteries/entities/interfaces/lotteries-map.interface';
import { LotteryInterface } from '../api/entities/incoming/lotteries/lotteries.interface';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../store/reducers/index';
import * as ticketsActions from '../../store/actions/tickets.actions';

@Component({
  selector: 'app-other-lotteries-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-other-lotteries
      [popularLotteries]="popularLotteries$ | async"
      [previousLottery]="previousLottery$ | async"
      [nextLottery]="nextLottery$ | async"

      (linkClickEvent)="onClickLinkEvent($event)"
    ></app-other-lotteries>
  `
})
export class OtherLotteriesContainerComponent implements OnInit {
  @Input() lotteryId: string;

  popularLotteries$: Observable<LotteryInterface[]>;
  previousLottery$: Observable<LotteryInterface>;
  nextLottery$: Observable<LotteryInterface>;

  constructor(private store: Store<fromRoot.State>,
              private lotteriesService: LotteriesService) {
  }

  ngOnInit(): void {
    this.popularLotteries$ = this.getPopularLotteries(3).publishReplay(1).refCount();

    this.previousLottery$ = this.getPrevNextLottery(
      this.lotteryId,
      this.popularLotteries$,
      this.lotteriesService.getSegmentationIdsMap(),
      -1
    );

    this.nextLottery$ = this.getPrevNextLottery(
      this.lotteryId,
      this.popularLotteries$,
      this.lotteriesService.getSegmentationIdsMap(),
      1
    );
  }

  onClickLinkEvent(lotteryName: string): void {
    this.store.dispatch(new ticketsActions.ClickOtherLotteriesLink({lotteryName}));
  }

  private getPopularLotteries(count?: number): Observable<LotteryInterface[]> {
    return combineLatest(
      this.lotteriesService.getPopularitylotteries(),
      this.lotteriesService.getSoldLotteriesMap(),
    ).pipe(
      map((data) => {
        const popLotteryIds: Array<string> = data[0];
        const soldLotteries: LotteriesMapInterface = data[1];
        const currentLotteryId = this.lotteryId;
        const popLotteries: Array<LotteryInterface> = [];

        popLotteryIds
          .forEach((lotteryId: string) => {
            Object.keys(soldLotteries).forEach((soldLotteryId: string) => {
              if (soldLotteryId === lotteryId && soldLotteryId !== currentLotteryId) {
                popLotteries.push(soldLotteries[soldLotteryId]);
                return;
              }
            });
          });

        return !!count && count > 0 ? popLotteries.slice(0, count) : popLotteries;
      })
    );
  }

  private getPrevNextLottery(currentLotteryId: string,
                             excludeLotteriesArray$: Observable<LotteryInterface[]>,
                             segmentationIds$: Observable<SegmentationIdsInterface>,
                             direction: number): Observable<LotteryInterface> {

    return combineLatest(
      excludeLotteriesArray$,
      segmentationIds$,
      this.lotteriesService.getSoldLotteriesMap()
    ).pipe(
      map(data => {
        const excludeLottriesArray = data[0];
        const segmentationIds = data[1];
        const soldLotteries: LotteriesMapInterface = data[2];
        const filteredSegmendationIds = {};

        Object.keys(segmentationIds).forEach(key => {
          const segmentationLotteryId = segmentationIds[key];

          if (!excludeLottriesArray.some((lottery: LotteryInterface) => lottery.id === segmentationLotteryId) &&
            typeof soldLotteries[segmentationLotteryId] !== 'undefined' &&
            soldLotteries[segmentationLotteryId] !== null) {
            filteredSegmendationIds[key] = segmentationLotteryId;
          }
        });


        const filteredSegmentationKeys = Object.keys(filteredSegmendationIds);
        const currentSegmentationId = filteredSegmentationKeys
          .find(key => filteredSegmendationIds[key] === currentLotteryId);

        let segmentationIdx = filteredSegmentationKeys.indexOf(currentSegmentationId);

        if (direction >= 0) {
          segmentationIdx += 1;

          if ((segmentationIdx + 1) > filteredSegmentationKeys.length) {
            segmentationIdx = 1;
          }
        } else if (direction < 0) {
          segmentationIdx -= 1;

          if (segmentationIdx < 0) {
            segmentationIdx = filteredSegmentationKeys.length - 1;
          }
        }

        const segmentationId = filteredSegmentationKeys[segmentationIdx];

        return filteredSegmendationIds[segmentationId];
      }),
      switchMap((lotteryId: string) => this.lotteriesService.getLottery(lotteryId))
    );
  }
}
