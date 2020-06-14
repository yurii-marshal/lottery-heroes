import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, map, publishReplay, refCount, switchMapTo, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { RequestQueryService } from '@libs/environment/services/queries/request-query.service';

import { BrandQueryService } from './brand-query.service';
import { CurrencyQueryService } from './currency-query.service';
import { QaQueryService } from './qa-query.service';
import { inArrayHelper } from '../../helpers';
import { LotteryModel } from '../../models/lottery.model';
import { getLotteriesEntities, getLotteriesLoaded } from '../../store/selectors/lotteries.selectors';
import {
  getLatestDrawsEntities, getLatestDrawsLoaded, getUpcomingDrawsEntities,
  getUpcomingDrawsLoaded
} from '../../store/selectors/draws.selectors';
import { getPricesEntities, getPricesLoaded } from '../../store/selectors/prices.selectors';
import { getOffersEntities, getOffersLoaded } from '../../store/selectors/offers.selectors';
import { BiglotteryowinCoreState } from '../../store/reducers';
import { LotteriesLoadAction } from '../../store/actions/lotteries.actions';
import { LatestDrawsLoadAction, UpcomingDrawsLoadAction } from '../../store/actions/draws.actions';
import { OffersLoadAction } from '../../store/actions/offers.actions';
import { PricesLoadAction } from '../../store/actions/prices.actions';

@Injectable()
export class LotteriesQueryService {
  private lotteryModelsMap$;
  private soldLotteryModelsMap$;
  private loadingDispatched = false;

  constructor(private store: Store<BiglotteryowinCoreState>,
              private requestQueryService: RequestQueryService,
              private brandQueryService: BrandQueryService,
              private currencyQueryService: CurrencyQueryService,
              private qaQueryService: QaQueryService) {
  }

  getLotteryModelsMap(): Observable<{[lotteryId: string]: LotteryModel}> {
    if (!this.lotteryModelsMap$) {
      this.lotteryModelsMap$ = combineLatest(
        this.store.select(getLotteriesLoaded),
        this.store.select(getUpcomingDrawsLoaded),
        this.store.select(getLatestDrawsLoaded),
        this.store.select(getPricesLoaded),
        this.store.select(getOffersLoaded),
      ).pipe(
        tap(([lotteriesLoaded, upcomingDrawsLoaded, latestDrawsLoaded, pricesLoaded, offersLoaded]: boolean[]) => {
          if (this.loadingDispatched === false) {
            this.loadingDispatched = true;

            if (lotteriesLoaded === false) {
              this.store.dispatch(new LotteriesLoadAction());
            }

            if (upcomingDrawsLoaded === false) {
              this.store.dispatch(new UpcomingDrawsLoadAction());
            }

            if (latestDrawsLoaded === false) {
              this.store.dispatch(new LatestDrawsLoadAction());
            }

            if (pricesLoaded === false) {
              this.store.dispatch(new PricesLoadAction());
            }

            if (offersLoaded === false) {
              this.store.dispatch(new OffersLoadAction());
            }
          }
        }),
        filter((loadedArr: boolean[]) => loadedArr.every(loaded => loaded === true)),
        switchMapTo(combineLatest(
          this.store.select(getLotteriesEntities),
          this.store.select(getUpcomingDrawsEntities),
          this.store.select(getLatestDrawsEntities),
          this.store.select(getPricesEntities),
          this.store.select(getOffersEntities),
          this.currencyQueryService.getSiteCurrencyId(),
          this.qaQueryService.getNullJackpotIds(),
        )),
        map(([
               lotteriesEntities,
               upcomingDrawsEntities,
               latestDrawsEntities,
               pricesEntities,
               offersEntities,
               siteCurrencyId,
               nullJackpotIds
             ]) => {
          const modelsMap: {[lotteryId: string]: LotteryModel} = {};

          Object.keys(lotteriesEntities).forEach((lotteryId: string) => {
            if (
              upcomingDrawsEntities[lotteryId]
              && latestDrawsEntities[lotteryId]
              && pricesEntities[lotteryId]
            ) {
              modelsMap[lotteryId] = new LotteryModel(
                lotteriesEntities[lotteryId],
                upcomingDrawsEntities[lotteryId],
                latestDrawsEntities[lotteryId],
                pricesEntities[lotteryId],
                offersEntities[lotteryId],
                this.requestQueryService.getLocationOrigin(),
                this.brandQueryService.getBrandId(),
                siteCurrencyId,
                inArrayHelper(nullJackpotIds, lotteryId)
              );
            }
          });

          return modelsMap;
        }),
        publishReplay(1),
        refCount(),
      );
    }

    return this.lotteryModelsMap$;
  }

  getSoldLotteryModelsMap(): Observable<{[lotteryId: string]: LotteryModel}> {
    if (!this.soldLotteryModelsMap$) {
      this.soldLotteryModelsMap$ = this.getLotteryModelsMap()
        .pipe(
          map((lotteriesMap: {[lotteryId: string]: LotteryModel}) => {
            const filteredList: LotteryModel[] = Object.keys(lotteriesMap)
              .map(lotteryId => lotteriesMap[lotteryId])
              .filter(lottery => lottery.isSold === true);

            return filteredList.reduce((result: {[lotteryId: string]: LotteryModel}, lottery: LotteryModel) => {
              result[lottery.lotteryId] = lottery;
              return result;
            }, {});
          }),
          publishReplay(1),
          refCount(),
        );
    }

    return this.soldLotteryModelsMap$;
  }

  getLotteryModelById(lotteryId: string): Observable<LotteryModel | undefined> {
    return this.getLotteryModelsMap()
      .pipe(
        map((lotteriesMap: {[lotteryId: string]: LotteryModel}) => lotteriesMap[lotteryId]),
        publishReplay(1),
        refCount(),
      );
  }

  getLotteryModelByLotId(lotId: number): Observable<LotteryModel | undefined> {
    return this.getLotteryModelsMap()
      .pipe(
        map((lotteriesMap: {[lotteryId: string]: LotteryModel}) => {
          const selectedLotteryId = Object.keys(lotteriesMap).find(lotteryId => lotteriesMap[lotteryId].lotid === lotId);
          return lotteriesMap[selectedLotteryId];
        }),
        publishReplay(1),
        refCount(),
      );
  }

  getLotteriesPopularityOrder(order: 'asc' | 'desc' = 'asc'): Observable<string[]> {
    return this.getLotteryModelsMap()
      .pipe(
        map((lotteriesMap: {[lotteryId: string]: LotteryModel}) => {
          return Object.keys(lotteriesMap)
            .map((lotteryId: string) => lotteriesMap[lotteryId])
            .sort((a: LotteryModel, b: LotteryModel) => {
              if (order === 'asc') {
                return a.popularity - b.popularity;
              } else if (order === 'desc') {
                return b.popularity - a.popularity;
              }
            })
            .map((lottery: LotteryModel) => lottery.lotteryId);
        }),
        publishReplay(1),
        refCount(),
      );
  }
}
