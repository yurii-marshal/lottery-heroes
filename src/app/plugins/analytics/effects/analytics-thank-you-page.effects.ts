import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { AnalyticsCommandService } from '../services';
import { WindowActionsTypes, NavigateBack } from '../../../store/actions/window.actions';
import {AddToCart, ListCombosActionsTypes} from '../../../pages/combos-page/modules/list-combos/actions/list-combos.actions';
import {ClickFollowUs, FollowUsActionsTypes} from '../../../pages/thank-you-page/modules/follow-us/actions/follow-us.actions';
import {
  ClickKeepMeUpdated,
  RealTimeNotificationsActionsTypes
} from '../../../pages/thank-you-page/modules/real-time-notifications/actions/real-time-notifications.actions';
import {
  AddSubscriptionToCart,
  SubscriptionDiscountActionsTypes
} from '../../../pages/thank-you-page/modules/subscription-discount/actions/subscription-discount.actions';
import {ListBundlesActionsTypes} from '../../../pages/bundles-page/modules/list-bundles/actions/list-bundles.actions';

@Injectable()
export class AnalyticsThankYouPageEffects {
  constructor(private actions$: Actions,
              private analyticsCommandService: AnalyticsCommandService) {
  }

  private pageUrl = '/cashier/thank-you';

  @Effect({dispatch: false})
  windowNavigateBack$ = this.actions$
    .ofType(WindowActionsTypes.NavigateBack)
    .pipe(
      tap((action: NavigateBack) => {
        if (action.payload.url === this.pageUrl) {
          this.analyticsCommandService.gtmEventToGa(
            'Thank-You page interactions',
            'thank-you - clicking back',
            'thank-you - clicking back'
          );
        }
      })
    );

  @Effect({dispatch: false})
  clickFollowUsOnFacebook$ = this.actions$
    .ofType(FollowUsActionsTypes.ClickFollowUs)
    .pipe(
      tap((action: ClickFollowUs) => {
        if (action.payload.url === this.pageUrl) {
          this.analyticsCommandService.gtmEventToGa(
            'Thank-You page interactions',
            'thank-you - social interactions',
            'thank-you -follow us on facebook - clicked'
          );
        }
      })
    );

  @Effect({dispatch: false})
  clickSelect$ = this.actions$
    .ofType(ListCombosActionsTypes.AddToCart)
    .pipe(
      tap((action: AddToCart) => {
        if (action.payload.url === this.pageUrl) {
          this.analyticsCommandService.gtmEventToGa(
            'Thank-You page interactions',
            'thank-you - combos interactions',
            `thank-you - ${action.payload.combo.name} - clicked`
          );
        }
      })
    );
    // .pipe(
    //   tap((action: AddToCart) => {
    //     if (action.payload.url === this.pageUrl) {
    //       this.analyticsCommandService.gtmEventToGa(
    //         'Thank-You page interactions',
    //         'thank-you - bundles interactions',
    //         `thank-you - ${action.payload.bundle.name} - clicked`
    //       );
    //     }
    //   })
    // );

  @Effect({dispatch: false})
  clickKeepMeUpdated$ = this.actions$
    .ofType(RealTimeNotificationsActionsTypes.ClickKeepMeUpdated)
    .pipe(
      tap((action: ClickKeepMeUpdated) => {
        if (action.payload.url === this.pageUrl) {
          this.analyticsCommandService.gtmEventToGa(
            'Thank-You page interactions',
            'thank-you - boxes interactions',
            'thank-you - mobile number box - clicked'
          );
        }
      })
    );

  @Effect({dispatch: false})
  addSubscriptionToCart$ = this.actions$
    .ofType(SubscriptionDiscountActionsTypes.AddSubscriptionToCart)
    .pipe(
      tap((action: AddSubscriptionToCart) => {
        if (action.payload.url === this.pageUrl) {
          this.analyticsCommandService.gtmEventToGa(
            'Thank-You page interactions',
            'thank-you - boxes interactions',
            'thank-you - subscription box - clicked'
          );
        }
      })
    );
}
