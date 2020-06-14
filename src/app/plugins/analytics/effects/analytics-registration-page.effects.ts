import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { AnalyticsCommandService } from '../services';
import { AuthActionTypes } from '../../../store/actions/auth.actions';

@Injectable()
export class AnalyticsRegistrationPageEffects {
  constructor(private actions$: Actions,
              private analyticsCommandService: AnalyticsCommandService) {
  }

  @Effect({dispatch: false})
  clickLiveChat$ = this.actions$
    .ofType(AuthActionTypes.ClickLiveChatRegistration)
    .pipe(
      tap(() => {
        this.analyticsCommandService.gtmEventToGa(
          'Registration',
          'Registration - live chat - clicked',
          'chat'
        );
      })
    );

  @Effect({dispatch: false})
  clickContactUs$ = this.actions$
    .ofType(AuthActionTypes.ClickContactUsRegistration)
    .pipe(
      tap(() => {
        this.analyticsCommandService.gtmEventToGa(
          'Registration',
          'Registration - contact us - clicked',
          'contact us'
        );
      })
    );
}
