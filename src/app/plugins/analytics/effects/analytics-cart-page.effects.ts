import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { AnalyticsCommandService } from '../services';
import {
  CartActionTypes,
  CartSyndicateAddShareAction,
  CartSyndicatePageLoadedAction,
  CartSyndicateRemoveShareAction,
  ChangeRenewPeriod,
  ClickNotificationAccept,
  ClickNotificationCancel,
  ClickNotificationClose,
  ClickSubscribe,
  ConditionForDealRelevant,
  OpenNotificationPopup
} from '../../../store/actions/cart.actions';

@Injectable()
export class AnalyticsCartPageEffects {
  constructor(private actions$: Actions,
              private analyticsCommandService: AnalyticsCommandService) {
  }

  @Effect({dispatch: false})
  clickSubscribe$ = this.actions$
    .ofType(CartActionTypes.ClickSubscribe)
    .pipe(
      tap((action: ClickSubscribe) => {
        this.analyticsCommandService.gtmEventToGa(
          'Cart interactions',
          'cart interactions - subscribe - clicked',
          action.payload.lotteryId
        );
      })
    );

  @Effect({dispatch: false})
  changeRenewPeriod$ = this.actions$
    .ofType(CartActionTypes.ChangeRenewPeriod)
    .pipe(
      tap((action: ChangeRenewPeriod) => {
        this.analyticsCommandService.gtmEventToGa(
          'Cart interactions',
          'cart interactions - subscribe box - clicked',
          action.payload.label
        );
      })
    );

  @Effect({dispatch: false})
  openNotificationPopup$ = this.actions$
    .ofType(CartActionTypes.OpenNotificationPopup)
    .pipe(
      tap((action: OpenNotificationPopup) => {
        this.analyticsCommandService.gtmEventToGa(
          'Cart interactions',
          'cart interactions - dont miss out pop up - presented',
          action.payload.lotteryId
        );
      })
    );

  @Effect({dispatch: false})
  clickNotificationAccept$ = this.actions$
    .ofType(CartActionTypes.ClickNotificationAccept)
    .pipe(
      tap((action: ClickNotificationAccept) => {
        this.analyticsCommandService.gtmEventToGa(
          'Cart interactions',
          'cart interactions - dont miss out pop up - add lines -clicked',
          action.payload.lotteryId
        );
      })
    );

  @Effect({dispatch: false})
  clickNotificationCancel$ = this.actions$
    .ofType(CartActionTypes.ClickNotificationCancel)
    .pipe(
      tap((action: ClickNotificationCancel) => {
        this.analyticsCommandService.gtmEventToGa(
          'Cart interactions',
          'cart interactions - dont miss out pop up - no thank you -clicked',
          action.payload.lotteryId
        );
      })
    );

  @Effect({dispatch: false})
  clickNotificationClose$ = this.actions$
    .ofType(CartActionTypes.ClickNotificationClose)
    .pipe(
      tap((action: ClickNotificationClose) => {
        this.analyticsCommandService.gtmEventToGa(
          'Cart interactions',
          'cart interactions - dont miss out pop up - close window -clicked',
          action.payload.lotteryId
        );
      })
    );

  @Effect({dispatch: false})
  conditionForDealRelevant$ = this.actions$
    .ofType(CartActionTypes.ConditionForDealRelevant)
    .pipe(
      tap((action: ConditionForDealRelevant) => {
        this.analyticsCommandService.gtmEventToGa(
          'Cart interactions',
          'cart interactions - proceed to checkout clicked - deal missing',
          action.payload.lotteryId
        );
      })
    );

  @Effect({dispatch: false})
  CartSyndicateAddShareAction$ = this.actions$
    .ofType(CartActionTypes.CartSyndicateAddShareAction)
    .pipe(
      tap((action: CartSyndicateAddShareAction) => {
        this.analyticsCommandService.gtmEventToGa(
          'Cart interactions',
          'cart interactions - add share clicked',
          'cart interactions - add share'
        );
      })
    );

  @Effect({dispatch: false})
  CartSyndicateRemoveShareAction$ = this.actions$
    .ofType(CartActionTypes.CartSyndicateRemoveShareAction)
    .pipe(
      tap((action: CartSyndicateRemoveShareAction) => {
        this.analyticsCommandService.gtmEventToGa(
          'Cart interactions',
          'cart interactions - remove share clicked',
          'cart interactions - remove share'
        );
      })
    );

  @Effect({dispatch: false})
  CartSyndicatePageLoadedAction$ = this.actions$
    .ofType(CartActionTypes.CartSyndicatePageLoadedAction)
    .pipe(
      tap((action: CartSyndicatePageLoadedAction) => {
        this.analyticsCommandService.gtmEventToGa(
          'Cart interactions',
          'cart interactions - cart with syndicate - load',
          `cart interactions - ${action.payload.lotteryId} - syndicate with ${action.payload.sharesAmount} shares left`
        );
      })
    );
}
