import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { SyndicateDto } from '@libs/biglotteryowin-api/dto/offerings/get-syndicates.dto';
import { OfferingsApiQueryService } from '@libs/biglotteryowin-api/services/queries/offerings-api-query.service';

import { BrandQueryService } from '../../services/queries/brand-query.service';
import { SyndicatesCommandService } from '../../services/commands/syndicates-command.service';
import { SyndicatesActionTypes, SyndicatesLoadFailAction, SyndicatesLoadSuccessAction } from '../actions/syndicates.actions';

@Injectable()
export class SyndicatesEffects {
  constructor(private actions$: Actions,
              private brandQueryService: BrandQueryService,
              private offeringsApiQueryService: OfferingsApiQueryService,
              private syndicatesCommandService: SyndicatesCommandService) {
  }

  @Effect()
  loadSyndicates$ = this.actions$
    .ofType(SyndicatesActionTypes.SyndicatesLoadAction)
    .pipe(
      map(() => this.brandQueryService.getBrandId()),
      switchMap((brandId: string) => {
        return this.offeringsApiQueryService.getSyndicates(brandId)
          .pipe(
            map((syndicates: SyndicateDto[]) => new SyndicatesLoadSuccessAction(syndicates)),
            catchError((error) => of(new SyndicatesLoadFailAction(error)))
          );
      })
    );

  @Effect({dispatch: false})
  refreshSyndicates$ = this.actions$
    .ofType(SyndicatesActionTypes.SyndicatesLoadSuccessAction)
    .pipe(
      tap((action: SyndicatesLoadSuccessAction) => this.syndicatesCommandService.scheduleRefresh(action.payload))
    );
}
