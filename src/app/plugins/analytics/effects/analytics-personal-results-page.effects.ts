import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AnalyticsCommandService } from '../services';
import { BoxClicked, BoxPresented, PageLoaded, PersonalResultsActionTypes } from '../../../store/actions/personal-results.actions';
import { tap } from 'rxjs/operators';

@Injectable()
export class AnalyticsPersonalResultsPageEffects {

  constructor(private actions$: Actions,
              private analyticsCommandService: AnalyticsCommandService) {}

  private pageUrl = '/myaccount/personal-results';

  @Effect({ dispatch: false })
  boxPresented$ = this.actions$
    .ofType(PersonalResultsActionTypes.BoxPresented)
    .pipe(
      tap((action: BoxPresented) => {
        if (action.payload.pageUrl.startsWith(this.pageUrl)) {
          this.analyticsCommandService.gtmEventToGa(
            'Personal Result Page',
            `Personal Result Page - Box ${ action.payload.boxNumber } - Presented`,
            action.payload.boxName
          );
        }
      })
    );

  @Effect({ dispatch: false })
  boxClicked$ = this.actions$
    .ofType(PersonalResultsActionTypes.BoxClicked)
    .pipe(
      tap((action: BoxClicked) => {
        if (action.payload.pageUrl.startsWith(this.pageUrl)) {
          this.analyticsCommandService.gtmEventToGa(
            'Personal Result Page',
            `Personal Result Page - Box ${ action.payload.boxNumber } - Clicked`,
            action.payload.boxName
          );
        }
      })
    );

  @Effect({ dispatch: false })
  pageLoaded$ = this.actions$
    .ofType(PersonalResultsActionTypes.PageLoaded)
    .pipe(
      tap((action: PageLoaded) => {
        this.analyticsCommandService.gtmEventToGa(
          'Personal Result Page',
          `Personal Result Page - Load`,
          action.payload.lotteryName
        );
      })
    );
}
