import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Effect, Actions } from '@ngrx/effects';
import { tap, map } from 'rxjs/operators';

import { RouterActionTypes, RouterGoAction } from '../actions/router.actions';

@Injectable()
export class RouterEffects {
  constructor(private actions$: Actions,
              private router: Router,
              private location: Location) {
  }

  @Effect({dispatch: false})
  navigate$ = this.actions$
    .ofType(RouterActionTypes.RouterGoAction)
    .pipe(
      map((action: RouterGoAction) => action.payload),
      tap(({path, queryParams, extras}) => {
        this.router.navigate(path, {queryParams, ...extras});
      })
    );

  @Effect({dispatch: false})
  navigateBack$ = this.actions$
    .ofType(RouterActionTypes.RouterBackAction)
    .pipe(
      tap(() => this.location.back())
    );

  @Effect({dispatch: false})
  navigateForward$ = this.actions$
    .ofType(RouterActionTypes.RouterForwardAction)
    .pipe(
      tap(() => this.location.forward())
    );
}
