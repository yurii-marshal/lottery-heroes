import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { AnalyticsCommandService } from '../services';
import {
  SyndicatePageActionTypes,
  SyndicatePageLoadedAction,
  SyndicatePageAddSharesAction,
  SyndicatePageAddToCartAction,
  SyndicatePageRemoveSharesAction,
  SyndicatePageShowLinesAction
} from '../../../pages/syndicate-page/store/actions/syndicate-page.actions';


@Injectable()
export class AnalyticsSyndicatePageEffects {
  constructor(private actions$: Actions,
              private analyticsCommandService: AnalyticsCommandService) {
  }

  @Effect({dispatch: false})
  SyndicatePageLoadedAction$ = this.actions$
    .ofType(SyndicatePageActionTypes.SyndicatePageLoadedAction)
    .pipe(
      tap((action: SyndicatePageLoadedAction) => {
        this.analyticsCommandService.gtmEventToGa(
          'Lottery ticket interactions',
          'syndicate interactions - syndicate page- load',
          `syndicate interactions - ${action.payload.sharesAmount} shares left`
        );
      })
    );

  @Effect({dispatch: false})
  SyndicatePageAddSharesAction$ = this.actions$
    .ofType(SyndicatePageActionTypes.SyndicatePageAddSharesAction)
    .pipe(
      tap((action: SyndicatePageAddSharesAction) => {
        this.analyticsCommandService.gtmEventToGa(
          'Lottery ticket interactions',
          'syndicate interactions - add share - clicked',
          `syndicate interactions - add share - ${action.payload.sharesBeforeClick}`
        );
      })
    );

  @Effect({dispatch: false})
  SyndicatePageRemoveSharesAction$ = this.actions$
    .ofType(SyndicatePageActionTypes.SyndicatePageRemoveSharesAction)
    .pipe(
      tap((action: SyndicatePageRemoveSharesAction) => {
        this.analyticsCommandService.gtmEventToGa(
          'Lottery ticket interactions',
          'syndicate interactions - reduce share - clicked',
          `syndicate interactions - reduce share - ${action.payload.sharesBeforeClick}`
        );
      })
    );

  @Effect({dispatch: false})
  SyndicatePageShowLinesAction$ = this.actions$
    .ofType(SyndicatePageActionTypes.SyndicatePageShowLinesAction)
    .pipe(
      tap((action: SyndicatePageShowLinesAction) => {
        this.analyticsCommandService.gtmEventToGa(
          'Lottery ticket interactions',
          'syndicate interactions - view lines - clicked',
          'syndicate interactions - view lines'
        );
      })
    );

  @Effect({dispatch: false})
  SyndicatePageAddToCartAction$ = this.actions$
    .ofType(SyndicatePageActionTypes.SyndicatePageAddToCartAction)
    .pipe(
      tap((action: SyndicatePageAddToCartAction) => {
        this.analyticsCommandService.gtmEventToGa(
          'Lottery ticket interactions',
          'ticket interactions - add to cart - clicked',
          action.payload.lotteryId
        );
      })
    );
}
