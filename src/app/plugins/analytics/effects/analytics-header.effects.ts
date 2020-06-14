import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {tap} from 'rxjs/operators';
import {AnalyticsCommandService} from '../services';
import {
  ClickHandPickNumbers,
  HeaderActionTypes,
  ClickSuperJackpotLottery,
  ClickQuickPick,
  ClickSelectCombo,
  ClickMobileScroll,
  ClickSelectBundle
} from '../../../modules/header/actions/header.actions';

@Injectable()
export class AnalyticsHeaderEffects {
  constructor(private actions$: Actions,
              private analyticsCommandService: AnalyticsCommandService) {
  }

  @Effect({dispatch: false})
  ClickHandPickNumbers$ = this.actions$
    .ofType(HeaderActionTypes.ClickHandPickNumbers)
    .pipe(
      tap((action: ClickHandPickNumbers) => {
        this.analyticsCommandService.gtmEventToGa(
          'Navigation',
          'mega menu - clicked',
          `mega menu - clicked - ${action.payload.menuName} - hand pick - ${action.payload.lotteryName}`
        );
      })
    );

  @Effect({dispatch: false})
  ClickSuperJackpotLottery$ = this.actions$
    .ofType(HeaderActionTypes.ClickSuperJackpotLottery)
    .pipe(
      tap((action: ClickSuperJackpotLottery) => {
        this.analyticsCommandService.gtmEventToGa(
          'Navigation',
          'navigation - clicked',
          `navigation - clicked - ${action.payload.lotteryName}`
        );
      })
    );

  @Effect({dispatch: false})
  ClickQuickPick$ = this.actions$
    .ofType(HeaderActionTypes.ClickQuickPick)
    .pipe(
      tap((action: ClickQuickPick) => {
        this.analyticsCommandService.gtmEventToGa(
          'Navigation',
          'mega menu - clicked',
          `mega menu - clicked - ${action.payload.menuName} - ${action.payload.lotteryName}`
        );
      })
    );

  @Effect({dispatch: false})
  ClickSelectCombo$ = this.actions$
    .ofType(HeaderActionTypes.ClickSelectCombo)
    .pipe(
      tap((action: ClickSelectCombo) => {
        this.analyticsCommandService.gtmEventToGa(
          'Navigation',
          'mega menu - clicked',
          `mega menu - clicked - combos - ${action.payload.comboName}`
        );
      })
    );

  @Effect({dispatch: false})
  ClickSelectBundle$ = this.actions$
    .ofType(HeaderActionTypes.ClickSelectBundle)
    .pipe(
      tap((action: ClickSelectBundle) => {
        this.analyticsCommandService.gtmEventToGa(
          'Navigation',
          'mega menu - clicked',
          `mega menu - clicked - bundles - ${action.payload.bundleName}`
        );
      })
    );

  @Effect({dispatch: false})
  ClickMobileScroll$ = this.actions$
    .ofType(HeaderActionTypes.ClickMobileScroll)
    .pipe(
      tap((action: ClickMobileScroll) => {
        this.analyticsCommandService.gtmEventToGa(
          'Mobile Scroll',
          'Scroll - Up',
          `mobile only`
        );
      })
    );
}
