import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { tap, filter, map, switchMap, first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { AnalyticsCommandService } from '../services';
import { DepositActionsTypes, DepositSubmitted } from '../../../pages/customer-feature/deposit/actions/deposit.actions';
import { WalletService } from '../../../services/wallet.service';
import { CurrencyService } from '../../../services/auth/currency.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AnalyticsDepositPageEffects {
  constructor(private actions$: Actions,
              private analyticsCommandService: AnalyticsCommandService,
              private walletService: WalletService,
              private currencyService: CurrencyService,
              @Inject(PLATFORM_ID) private platformId: Object) {
  }

  @Effect({ dispatch: false })
  depositSuccess$ = this.actions$
    .ofType(DepositActionsTypes.DepositSuccess)
    .pipe(
      switchMap(() => {
        const depositAmount$: Observable<number> = this.getDepositAmount();
        const currencyId$: Observable<string> = this.currencyService.getCurrencyId();

        return combineLatest(depositAmount$, currencyId$).pipe(
          first()
        );
      }),
      tap((data: any) => {
          const amount = data[0];
          const currencyId = data[1];
          const count = this.walletService.getCurrentDepositTransactionCount() + 1;

          const depositCustomEventParams = {
            'GA_event_sub_label': `${count}`
          };

          if (!amount && !count) {
            return;
          }

          if (count === 1) {
            depositCustomEventParams['currency'] = currencyId;

            this.analyticsCommandService.gtmEventToGa(
              'Transactions',
              'deposit - first deposit',
              `${amount}`,
              depositCustomEventParams
            );
          } else {
            this.analyticsCommandService.gtmEventToGa(
              'Transactions',
              'deposit success',
              `${amount}`,
              depositCustomEventParams
            );
          }
      })
    );

  @Effect({ dispatch: false })
  depositSubmitted$ = this.actions$
    .ofType(DepositActionsTypes.DepositSubmitted)
    .pipe(
      tap((action: DepositSubmitted) => {
        this.analyticsCommandService.gtmEventToGa(
          'Transactions',
          'deposit click submit',
          action.payload.label
        );
      })
    );

  private getDepositAmount(): Observable<number> {
    return this.walletService
      .getCurrentDepositAmount()
      .pipe(
        filter((amount: number | undefined) => typeof amount !== 'undefined')
      );
  }
}
