import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { AnalyticsCommandService } from '../services';
import { HowToPlayActionTypes, ClickPlayLotteryAction } from '../../../pages/how-to-play/strore/actions/how-to-play.actions';

@Injectable()
export class AnalyticsHowToPlayPageEffects {
  constructor(private actions$: Actions,
              private analyticsCommandService: AnalyticsCommandService) {
  }

  @Effect({dispatch: false})
  clickPlayLottery$ = this.actions$
    .ofType(HowToPlayActionTypes.ClickPlayLotteryAction)
    .pipe(
      tap((action: ClickPlayLotteryAction) => {
        this.analyticsCommandService.gtmEventToGa(
          'Lottery ticket interactions',
          'ticket interactions - how to play cta - clicked',
          action.payload.lotteryId
        );
      })
    );
}
