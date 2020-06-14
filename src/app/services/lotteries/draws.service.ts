import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { MemoryCacheService } from '../cache/memory-cache.service';
import { RefreshService } from '../refresh.service';

import { DrawsMapInterface } from './entities/interfaces/draws-map.interface';
import { DrawInterface } from '../../modules/api/entities/incoming/lotteries/draws.interface';

import { ObjectsUtil } from '../../modules/shared/utils/objects.util';
import { CurrencyService } from '../auth/currency.service';
import { LotteriesApiService } from '../../modules/api/lotteries.api.service';
import { Store } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { getRouterStateUrl, RouterStateUrl } from '../../upgraded/libs/router-store/reducers';
import { map, switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Injectable()
export class DrawsService {
  private upcomingDrawsListSubject$: ReplaySubject<DrawInterface[]>;
  private upcomingDrawsList$: Observable<DrawInterface[]>;

  private latestDrawsListSubject$: ReplaySubject<DrawInterface[]>;
  private latestDrawsList$: Observable<DrawInterface[]>;

  private upcomingDrawsMapSubject$: ReplaySubject<DrawsMapInterface>;
  private upcomingDrawsMap$: Observable<DrawsMapInterface>;

  private latestDrawsMapSubject$: ReplaySubject<DrawsMapInterface>;
  private latestDrawsMap$: Observable<DrawsMapInterface>;

  private static convertDrawsListToMap(list: Array<DrawInterface>): DrawsMapInterface {
    return list.reduce((resultMap: DrawsMapInterface, draw: DrawInterface) => {
      return Object.assign(resultMap, {
        [draw.lottery_id]: draw
      });
    }, {});
  }

  constructor(private lotteriesApiService: LotteriesApiService,
              private memoryCacheService: MemoryCacheService,
              private refreshService: RefreshService,
              private zone: NgZone,
              private store: Store<RouterReducerState<RouterStateUrl>>,
              private currencyService: CurrencyService) {
    this.upcomingDrawsListSubject$ = new ReplaySubject(1);
    this.upcomingDrawsList$ = this.upcomingDrawsListSubject$.asObservable();

    this.latestDrawsListSubject$ = new ReplaySubject(1);
    this.latestDrawsList$ = this.latestDrawsListSubject$.asObservable();

    this.upcomingDrawsMapSubject$ = new ReplaySubject(1);
    this.upcomingDrawsMap$ = this.upcomingDrawsMapSubject$.asObservable();

    this.latestDrawsMapSubject$ = new ReplaySubject(1);
    this.latestDrawsMap$ = this.latestDrawsMapSubject$.asObservable();

    this.upcomingDrawsList$
      .map((drawsList: Array<DrawInterface>) => DrawsService.convertDrawsListToMap(drawsList))
      .subscribe((drawsMap: DrawsMapInterface) => this.upcomingDrawsMapSubject$.next(drawsMap));

    this.latestDrawsList$
      .map((drawsList: Array<DrawInterface>) => DrawsService.convertDrawsListToMap(drawsList))
      .subscribe((drawsMap: DrawsMapInterface) => this.latestDrawsMapSubject$.next(drawsMap));

    this.zone.runOutsideAngular(() => {
      this.refreshService.getRefreshEventEmitter().subscribe(() => {
        this.zone.run(() => {
          this.loadUpcomingDraws();
          this.loadLatestDraws();
        });
      });
    });

    this.loadUpcomingDraws();
    this.loadLatestDraws();
  }

  loadUpcomingDraws(): void {
    this.currencyService.getCurrencyId()
      .switchMap((siteCurrencyId: string) => this.lotteriesApiService.getDrawsList({upcoming: true, currencyId: siteCurrencyId}))
      .map((drawsList: Array<DrawInterface>) => drawsList.filter(draw => new Date(draw.date).getTime() - new Date().getTime() > 0))
      .subscribe((drawsList: Array<DrawInterface>) => this.upcomingDrawsListSubject$.next(drawsList));
  }

  loadLatestDraws(): void {
    this.currencyService.getCurrencyId()
      .switchMap((siteCurrencyId: string) => this.lotteriesApiService.getDrawsList({latest: true, currencyId: siteCurrencyId}))
      .subscribe((drawsList: Array<DrawInterface>) => this.latestDrawsListSubject$.next(drawsList));
  }

  getUpcomingDrawsList(): Observable<DrawInterface[]> {
    return this.upcomingDrawsList$;
  }

  getLatestDrawsList(): Observable<DrawInterface[]> {
    return this.latestDrawsList$;
  }

  getUpcomingDrawsMap(): Observable<DrawsMapInterface> {
    return combineLatest(
      this.store.select(getRouterStateUrl),
      this.upcomingDrawsMap$,
    )
      .pipe(
        map(([routerStateUrl, upcomingDrawsMap]) => {
          // Sets null jackpot for e2e tests purposes
          if (typeof routerStateUrl.queryParams['qa-nojackpot'] !== 'undefined') {
            const noJackpotLotteryIds = routerStateUrl.queryParams['qa-nojackpot'].split(',');

            noJackpotLotteryIds.forEach((lotteryId) => {
              if (typeof upcomingDrawsMap[lotteryId] !== 'undefined') {
                upcomingDrawsMap[lotteryId].jackpot = null;
              }
            });
          }

          return upcomingDrawsMap;
        })
      );
  }

  getLatestDrawsMap(): Observable<DrawsMapInterface> {
    return this.latestDrawsMap$;
  }

  getUpcomingDraw(lotteryId: string): Observable<DrawInterface> {
    return this.upcomingDrawsMap$
      .filter((drawsMap: DrawsMapInterface) => !ObjectsUtil.isEmptyObject(drawsMap))
      .map((drawsMap: DrawsMapInterface) => drawsMap[lotteryId]);
  }

  getLatestDraw(lotteryId: string): Observable<DrawInterface> {
    return this.latestDrawsMap$
      .filter((drawsMap: DrawsMapInterface) => !ObjectsUtil.isEmptyObject(drawsMap))
      .map((drawsMap: DrawsMapInterface) => drawsMap[lotteryId]);
  }

  getLastLotteryDraws(lotteryId: string, numberOfDraws = 10): Observable<DrawInterface[]> {
    const cacheKey = `DrawsService.getLastLotteryDraws(${lotteryId}, ${numberOfDraws})`;

    if (!this.memoryCacheService.hasData(cacheKey)) {
      this.memoryCacheService.setData(cacheKey, this.currencyService.getCurrencyId()
        .switchMap((siteCurrencyId: string) => this.lotteriesApiService.getDrawsList({
          lotteriesIds: [lotteryId],
          limit: numberOfDraws,
          currencyId: siteCurrencyId
        }))
        .publishReplay()
        .refCount());
    }

    return this.memoryCacheService.getData(cacheKey);
  }

  getDraw(drawId: number): Observable<DrawInterface> {
    const cacheKey = `DrawsService.getDraw(${drawId})`;

    if (!this.memoryCacheService.hasData(cacheKey)) {
      this.memoryCacheService.setData(cacheKey, this.lotteriesApiService.getDraw(drawId).publishLast().refCount());
    }

    return this.memoryCacheService.getData(cacheKey);
  }

  /**
   * @param lotteryId
   * @param dateLocal in format 'YYYY-MM-DD'
   * @returns {Observable<DrawInterface>}
   */
  getDrawByDate(lotteryId: string, dateLocal: string): Observable<DrawInterface> {
    const cacheKey = `DrawsService.getDrawByDate(${lotteryId}, ${dateLocal})`;

    if (!this.memoryCacheService.hasData(cacheKey)) {
      this.memoryCacheService.setData(cacheKey, this.lotteriesApiService.getDrawByDate(lotteryId, dateLocal).publishLast().refCount());
    }

    return this.memoryCacheService.getData(cacheKey);
  }
}
