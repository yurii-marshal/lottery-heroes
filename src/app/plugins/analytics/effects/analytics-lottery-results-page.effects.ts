import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { AnalyticsCommandService } from '../services';
import {
  LotteryResultsActionTypes,
  ShowConversionLightBox,
  ClickConversionToTicketPage,
  ClickConversionCancel,
  ClickConversionClose,
} from '../../../store/actions/lottery-results.action';


@Injectable()
export class AnalyticsLotteryResultsPageEffects {
  constructor(private actions$: Actions,
              private analyticsCommandService: AnalyticsCommandService) {
  }

  @Effect({dispatch: false})
  showConversionLightbox$ = this.actions$
    .ofType(LotteryResultsActionTypes.ShowConversionLightBox)
    .pipe(
      tap((action: ShowConversionLightBox) => {
        this.analyticsCommandService.gtmEventToGa(
          'Lottery result page',
          'Lottery result page - play pop up - presented',
          action.payload.lotteryName
        );
      })
    );

  @Effect({dispatch: false})
  clickConversionToticketPage$ = this.actions$
    .ofType(LotteryResultsActionTypes.ClickConversionToTicketPage)
    .pipe(
      tap((action: ClickConversionToTicketPage) => {
        this.analyticsCommandService.gtmEventToGa(
          'Lottery result page',
          'Lottery result page - play pop up - I want to play - clicked',
          action.payload.lotteryName
        );
      })
    );

  @Effect({dispatch: false})
  clickConversionCancel$ = this.actions$
    .ofType(LotteryResultsActionTypes.ClickConversionCancel)
    .pipe(
      tap((action: ClickConversionCancel) => {
        this.analyticsCommandService.gtmEventToGa(
          'Lottery result page',
          'Lottery result page - play pop up - not right now - clicked',
          action.payload.lotteryName
        );
      })
    );

  @Effect({dispatch: false})
  clickConversionClose$ = this.actions$
    .ofType(LotteryResultsActionTypes.ClickConversionClose)
    .pipe(
      tap((action: ClickConversionClose) => {
        this.analyticsCommandService.gtmEventToGa(
          'Lottery result page',
          'Lottery result page - play pop up - close window - clicked',
          action.payload.lotteryName
        );
      })
    );
}
