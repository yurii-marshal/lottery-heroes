import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { SeoCommandService } from '../services/seo-command.service';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';

@Injectable()
export class SeoEffects {
  constructor(private actions$: Actions,
              private seoCommandService: SeoCommandService) {
  }

  @Effect({dispatch: false})
  setHreflang$ = this.actions$
    .ofType(ROUTER_NAVIGATION)
    .pipe(
      tap((data: RouterNavigationAction) => {
        this.seoCommandService.setCanonical(data.payload.routerState.url);
        this.seoCommandService.setHrefLang(data.payload.routerState.url);
      })
    );
}
