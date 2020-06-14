import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { AnalyticsCommandService } from '../services';

import {
  ChangeRenewPeriod, ClickFreeLineMobile, ClickPickYourOwnMobile, ClickEditLineMobile, TicketsActionTypes, ClickOtherLotteriesLink
} from '../../../store/actions/tickets.actions';

@Injectable()
export class AnalyticsTicketsPageEffects {
  constructor(private actions$: Actions,
              private analyticsCommandService: AnalyticsCommandService) {
  }

  @Effect({dispatch: false})
  changeRenewPeriod$ = this.actions$
    .ofType(TicketsActionTypes.ChangeRenewPeriod)
    .pipe(
      tap((action: ChangeRenewPeriod) => {
        this.analyticsCommandService.gtmEventToGa(
          'Lottery ticket interactions',
          'ticket interactions - purchase method - clicked',
          action.payload.label
        );
      })
    );

  @Effect({ dispatch: false })
  ClickPickYourOwnMobile$ = this.actions$
    .ofType(TicketsActionTypes.ClickPickYourOwnMobile)
    .pipe(
      tap((action: ClickPickYourOwnMobile) => {
        this.analyticsCommandService.gtmEventToGa(
          'Lottery ticket interactions',
          'ticket interactions - manual select line - clicked',
            `ticket interactions - manual select line - ${action.payload.lineNumber}`
        );
      })
    );

  @Effect({ dispatch: false })
  clickFreeLineMobile$ = this.actions$
    .ofType(TicketsActionTypes.ClickFreeLineMobile)
    .pipe(
      tap((action: ClickFreeLineMobile) => {
        this.analyticsCommandService.gtmEventToGa(
          'Lottery ticket interactions',
          'ticket interactions - free line - clicked',
          `ticket interactions - free line - ${action.payload.numberOfLines}`
        );
      })
    );

  @Effect({ dispatch: false })
  clickEditLineMobile$ = this.actions$
    .ofType(TicketsActionTypes.ClickEditLineMobile)
    .pipe(
      tap((action: ClickEditLineMobile) => {
        this.analyticsCommandService.gtmEventToGa(
          'Lottery ticket interactions',
          'ticket interactions - edit line - clicked',
          `ticket interactions - edit line - ${action.payload.numberOfLine}`
        );
      })
    );

  @Effect({ dispatch: false })
  clickOtherLotteriesLink$ = this.actions$
    .ofType(TicketsActionTypes.ClickOtherLotteriesLink)
    .pipe(
      tap((action: ClickOtherLotteriesLink) => {
        this.analyticsCommandService.gtmEventToGa(
          'Lottery ticket interactions',
          'ticket interactions - other lotteries - clicked',
          action.payload.lotteryName
        );
      })
    );
}
