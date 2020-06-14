import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, OnDestroy, Renderer2 } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, map, publishReplay, refCount, switchMap, takeUntil } from 'rxjs/operators';

import { getRouterStateUrl, RouterStateUrl } from 'app/upgraded/libs/router-store/reducers/index';
import { LotteriesQueryService } from 'app/upgraded/libs/biglotteryowin-core/services/queries/lotteries-query.service';
import { SyndicatesQueryService } from 'app/upgraded/libs/biglotteryowin-core/services/queries/syndicates-query.service';
import { inArrayHelper } from 'app/upgraded/libs/biglotteryowin-core/helpers';
import { LotteryModel } from 'app/upgraded/libs/biglotteryowin-core/models/lottery.model';

import { LotteriesSortByType } from './types/lotteries-sort-by.type';
import { ScrollService } from '../../services/device/scroll.service';
import { MetaService } from '../../modules/meta/services/meta.service';

@Component({
  selector: 'app-lotteries-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-lotteries
      [sortBy]="sortBy$|async"
      [sortedLotteryIds]="sortedLotteryIds$|async"
    ></app-lotteries>
  `
})
export class LotteriesContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  sortBy$: Observable<LotteriesSortByType>;
  sortedLotteryIds$: Observable<string[]>;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private store: Store<RouterReducerState<RouterStateUrl>>,
              private lotteriesQueryService: LotteriesQueryService,
              private syndicatesQueryService: SyndicatesQueryService,
              private scrollService: ScrollService,
              private metaService: MetaService,
              private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.metaService.setFromConfig('page', 'lotteries');

    this.sortBy$ = this.store.select(getRouterStateUrl)
      .pipe(
        filter((routerStateUrl: RouterStateUrl) => routerStateUrl.urlWithoutQueryParams === '/lotteries'),
        map((routerStateUrl: RouterStateUrl) => {
          const possibleSortTypes: LotteriesSortByType[] = ['jackpot', 'offers', 'dateasc'];

          let sortBy: LotteriesSortByType = 'jackpot';
          if (inArrayHelper(possibleSortTypes, routerStateUrl.queryParams['sort'])) {
            sortBy = routerStateUrl.queryParams['sort'];
          }

          return sortBy;
        }),
        publishReplay(1),
        refCount(),
      );

    const sortUnits$ = combineLatest(
      this.lotteriesQueryService.getLotteriesPopularityOrder(),
      this.lotteriesQueryService.getSoldLotteryModelsMap(),
      this.syndicatesQueryService.getSyndicateModelsMap(),
    ).pipe(
      map(([lotteriesPopularityOrder, soldLotteryModelsMap, syndicateModelsMap]) => {
        const sortUnits: Array<{
          lotteryId: string;
          popularity: number;
          jackpot: number;
          offers: number;
          date: Date;
        }> = [];

        lotteriesPopularityOrder.forEach((lotteryId: string) => {
          if (typeof soldLotteryModelsMap[lotteryId] !== 'undefined') {
            sortUnits.push({
              lotteryId: lotteryId,
              popularity: soldLotteryModelsMap[lotteryId].popularity,
              jackpot: soldLotteryModelsMap[lotteryId].jackpot !== null
                ? soldLotteryModelsMap[lotteryId].jackpot
                : soldLotteryModelsMap[lotteryId].minJackpot,
              offers: typeof soldLotteryModelsMap[lotteryId].freeLinesOffer === 'undefined' ? 0 : 1,
              date: soldLotteryModelsMap[lotteryId].lastTicketTime,
            });
          } else if (typeof syndicateModelsMap[lotteryId] !== 'undefined') {
            sortUnits.push({
              lotteryId: lotteryId,
              popularity: syndicateModelsMap[lotteryId].lotteryPopularity,
              jackpot: syndicateModelsMap[lotteryId].jackpot !== null
                ? syndicateModelsMap[lotteryId].jackpot
                : syndicateModelsMap[lotteryId].minJackpot,
              offers: 0,
              date: syndicateModelsMap[lotteryId].stopSellTime,
            });
          }
        });

        return sortUnits;
      })
    );

    this.sortedLotteryIds$ = combineLatest(
      this.sortBy$,
      sortUnits$,
    ).pipe(
      map(([sortBy, sortUnits]) => {
        switch (sortBy) {
          case 'jackpot':
          case 'offers':
            sortUnits = sortUnits.sort((a, b) => {
              const comparator = b[sortBy] - a[sortBy];
              return comparator === 0 ? a.popularity - b.popularity : comparator;
            });
            break;
          case 'dateasc':
            sortUnits = sortUnits.sort((a, b) => {
              const comparator = a.date.getTime() - b.date.getTime();
              return comparator === 0 ? a.popularity - b.popularity : comparator;
            });
            break;
        }

        return sortUnits.map(unit => unit.lotteryId);
      })
    );
  }

  ngAfterViewInit(): void {
    this.store.select(getRouterStateUrl)
      .pipe(
        map((routerStateUrl: RouterStateUrl) => routerStateUrl.queryParams['lotid']),
        filter((lotId: string | undefined) => lotId !== 'undefined' && lotId !== ''),
        switchMap((lotId: string) => this.lotteriesQueryService.getLotteryModelByLotId(Number(lotId))),
        filter((lottery: LotteryModel | undefined) => typeof lottery !== 'undefined'),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((lottery: LotteryModel) =>
        this.scrollService.scrollToSmooth(this.renderer.selectRootElement('#' + lottery.lotteryId))
      );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
