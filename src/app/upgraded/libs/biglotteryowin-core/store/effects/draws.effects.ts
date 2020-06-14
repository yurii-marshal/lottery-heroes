import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, combineLatest, map, mergeMap, switchMap, tap } from 'rxjs/operators';

import { LotteriesApiQueryService } from '@libs/biglotteryowin-api/services/queries/lotteries-api-query.service';
import { DrawDto } from '@libs/biglotteryowin-api/dto/lotteries/draw.dto';
import { SingleDrawDto } from '@libs/biglotteryowin-api/dto/lotteries/single-draw.dto';

import { CurrencyQueryService } from '../../services/queries/currency-query.service';
import { DrawsCommandService } from '../../services/commands/draws-command.service';
import {
  DrawByDateLocalLoadAction,
  DrawByDateLocalLoadFailAction,
  DrawByDateLocalLoadSuccessAction,
  DrawsActionTypes,
  DrawsByIdLoadAction,
  DrawsByIdLoadFailAction,
  DrawsByIdLoadSuccessAction,
  LatestDrawsLoadFailAction,
  LatestDrawsLoadSuccessAction,
  UpcomingDrawsLoadFailAction,
  UpcomingDrawsLoadSuccessAction
} from '../actions/draws.actions';

@Injectable()
export class DrawsEffects {
  constructor(private actions$: Actions,
              private currencyQueryService: CurrencyQueryService,
              private lotteriesApiQueryService: LotteriesApiQueryService,
              private drawsCommandService: DrawsCommandService) {
  }

  @Effect()
  loadUpcomingDraws$ = this.actions$
    .ofType(DrawsActionTypes.UpcomingDrawsLoadAction)
    .pipe(
      switchMap(() => this.currencyQueryService.getSiteCurrencyId()),
      switchMap((siteCurrencyId: string) => {
        return this.lotteriesApiQueryService.getDraws({upcoming: true, currencyId: siteCurrencyId})
          .pipe(
            map((draws: DrawDto[]) => new UpcomingDrawsLoadSuccessAction(draws)),
            catchError((error) => of(new UpcomingDrawsLoadFailAction(error)))
          );
      })
    );

  @Effect()
  loadLatestDraws$ = this.actions$
    .ofType(DrawsActionTypes.LatestDrawsLoadAction)
    .pipe(
      switchMap(() => this.currencyQueryService.getSiteCurrencyId()),
      switchMap((siteCurrencyId: string) => {
        return this.lotteriesApiQueryService.getDraws({latest: true, currencyId: siteCurrencyId})
          .pipe(
            map((draws: DrawDto[]) => new LatestDrawsLoadSuccessAction(draws)),
            catchError((error) => of(new LatestDrawsLoadFailAction(error)))
          );
      })
    );

  @Effect()
  loadDrawsById$ = this.actions$
    .ofType(DrawsActionTypes.DrawsByIdLoadAction)
    .pipe(
      combineLatest(this.currencyQueryService.getSiteCurrencyId()),
      mergeMap(([drawsByIdLoadAction, siteCurrencyId]: [DrawsByIdLoadAction, string]) => {
        return this.lotteriesApiQueryService.getDrawsById(drawsByIdLoadAction.payload, siteCurrencyId)
          .pipe(
            map((draws: DrawDto[]) => new DrawsByIdLoadSuccessAction(draws)),
            catchError((error) => of(new DrawsByIdLoadFailAction(error)))
          );
      })
    );

  @Effect()
  loadDrawByDateLocal$ = this.actions$
    .ofType(DrawsActionTypes.DrawByDateLocalLoadAction)
    .pipe(
      mergeMap((action: DrawByDateLocalLoadAction) => {
        return this.lotteriesApiQueryService.getDrawByDateLocal(action.payload.lotteryId, action.payload.dateLocal)
          .pipe(
            map((draw: SingleDrawDto) => new DrawByDateLocalLoadSuccessAction(draw)),
            catchError((error) => of(new DrawByDateLocalLoadFailAction(error)))
          );
      })
    );

  @Effect({dispatch: false})
  refreshDraws$ = this.actions$
    .ofType(DrawsActionTypes.UpcomingDrawsLoadSuccessAction)
    .pipe(
      tap((action: UpcomingDrawsLoadSuccessAction) => this.drawsCommandService.scheduleRefresh(action.payload))
    );
}
