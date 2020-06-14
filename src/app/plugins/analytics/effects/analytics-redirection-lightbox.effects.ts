import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { AnalyticsCommandService } from '../services';
import { LightboxesActionsTypes, LightboxPopup } from '../../../modules/lightboxes/actions/lightboxes.actions';

@Injectable()
export class AnalyticsLightboxesEffects {
  constructor(private actions$: Actions,
              private analyticsCommandService: AnalyticsCommandService) {
  }

  @Effect({dispatch: false})
  lightboxPopup$ = this.actions$
    .ofType(LightboxesActionsTypes.LightboxPopup)
    .pipe(
      tap((action: LightboxPopup) => {
        if (action.payload.lightboxName === 'redirection') {
          this.analyticsCommandService.gtmEventToGa(
            'Redirection',
            'redirection lightbox presented',
            'redirection'
          );
        }
      })
    );

  @Effect({dispatch: false})
  redirected$ = this.actions$
    .ofType(LightboxesActionsTypes.RedirectionLightboxRedirected)
    .pipe(
      tap(() => {
        this.analyticsCommandService.gtmEventToGa(
          'Redirection',
          'redirection - take me - clicked',
          'redirected'
        );
      })
    );

  @Effect({dispatch: false})
  clickStay$ = this.actions$
    .ofType(LightboxesActionsTypes.RedirectionLightboxClickStay)
    .pipe(
      tap(() => {
        this.analyticsCommandService.gtmEventToGa(
          'Redirection',
          'redirection - stay - clicked',
          'stay'
        );
      })
    );

}
