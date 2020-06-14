import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, map, publishReplay, refCount, switchMapTo, tap, combineLatest as combineLatestOp } from 'rxjs/operators';

import { inArrayHelper } from '../../helpers';
import { LotteriesQueryService } from './lotteries-query.service';
import { CurrencyQueryService } from './currency-query.service';
import { QaQueryService } from './qa-query.service';
import { SyndicatesLoadAction } from '../../store/actions/syndicates.actions';
import { BiglotteryowinCoreState } from '../../store/reducers';
import { getSyndicatesEntities, getSyndicatesLoaded } from '../../store/selectors/syndicates.selectors';
import { getDrawByIdEntities } from '../../store/selectors/draws.selectors';
import { DrawsByIdLoadAction } from '../../store/actions/draws.actions';
import { SyndicateModel } from '../../models/syndicate.model';

@Injectable()
export class SyndicatesQueryService {
  private syndicateModelsMap$;

  constructor(private store: Store<BiglotteryowinCoreState>,
              private lotteriesQueryService: LotteriesQueryService,
              private currencyQueryService: CurrencyQueryService,
              private qaQueryService: QaQueryService) {
  }

  getSyndicateModelsMap(): Observable<{[lotteryId: string]: SyndicateModel}> {
    if (!this.syndicateModelsMap$) {
      this.syndicateModelsMap$ = this.store.select(getSyndicatesLoaded)
        .pipe(
          tap((syndicatesLoaded: boolean) => {
            if (syndicatesLoaded === false) {
              this.store.dispatch(new SyndicatesLoadAction());
            }
          }),
          filter((syndicatesLoaded: boolean) => syndicatesLoaded === true),
        )
        .pipe(
          switchMapTo(this.store.select(getSyndicatesEntities)),
          map((syndicatesEntities) => {
            return Object.keys(syndicatesEntities)
              .map(lotteryId => syndicatesEntities[lotteryId].drawId);
          }),
          combineLatestOp(this.store.select(getDrawByIdEntities)),
          tap(([drawIds, drawByIdEntities]) => {
            const missingDrawIds = drawIds.filter((drawId: number) => typeof drawByIdEntities[drawId.toString()] === 'undefined');
            if (missingDrawIds.length > 0) {
              this.store.dispatch(new DrawsByIdLoadAction(missingDrawIds));
            }
          }),
          filter(([drawIds, drawByIdEntities]) => drawIds.every((drawId: number) => !!drawByIdEntities[drawId.toString()])),
        )
        .pipe(
          switchMapTo(combineLatest(
            this.store.select(getSyndicatesEntities),
            this.lotteriesQueryService.getLotteryModelsMap(),
            this.store.select(getDrawByIdEntities),
            this.currencyQueryService.getSiteCurrencyId(),
            this.qaQueryService.getNullJackpotIds(),
          )),
          map(([syndicatesEntities, lotteryModelsMap, drawByIdEntities, siteCurrencyId, nullJackpotIds]) => {
            const modelsMap: {[lotteryId: string]: SyndicateModel} = {};

            Object.keys(syndicatesEntities).forEach((lotteryId: string) => {
              if (lotteryModelsMap[lotteryId]) {
                modelsMap[lotteryId] = new SyndicateModel(
                  syndicatesEntities[lotteryId],
                  lotteryModelsMap[lotteryId],
                  drawByIdEntities[syndicatesEntities[lotteryId].drawId.toString()],
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

    return this.syndicateModelsMap$;
  }

  getSyndicateModelByLotteryId(lotteryId: string): Observable<SyndicateModel | undefined> {
    return this.getSyndicateModelsMap()
      .pipe(
        map((syndicateModelsMap: {[lotteryId: string]: SyndicateModel}) => syndicateModelsMap[lotteryId]),
        publishReplay(1),
        refCount(),
      );
  }
}
