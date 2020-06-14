import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { AnalyticsCommandService } from '../services';
import { CashierActionTypes } from '../../../modules/payment/actions/cashier.actions';

@Injectable()
export class AnalyticsCashierPageEffects {
  constructor(private actions$: Actions,
              private analyticsCommandService: AnalyticsCommandService) {
  }

  @Effect({dispatch: false})
  clickLiveChat$ = this.actions$
    .ofType(CashierActionTypes.ClickLiveChat)
    .pipe(
      tap(() => {
        this.analyticsCommandService.gtmEventToGa(
          'Transactions',
          'deposit form- live chat - clicked',
          'chat'
        );
      })
    );

  @Effect({dispatch: false})
  clickSupportEmail$ = this.actions$
    .ofType(CashierActionTypes.ClickSupportEmail)
    .pipe(
      tap(() => {
        this.analyticsCommandService.gtmEventToGa(
          'Transactions',
          'deposit form- support email - clicked',
          'support email'
        );
      })
    );

  @Effect({dispatch: false})
  clickNewPlayingLimit$ = this.actions$
    .ofType(CashierActionTypes.ClickNewPlayingLimit)
    .pipe(
      tap(() => {
        this.analyticsCommandService.gtmEventToGa(
          'Transactions',
          'deposit form- new playing limit - clicked',
          'new playing limit'
        );
      })
    );

}
