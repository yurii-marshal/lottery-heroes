import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';

import { OfferingsApiQueryService } from '@libs/biglotteryowin-api/services/queries/offerings-api-query.service';
import { PricesMapDto } from '@libs/biglotteryowin-api/dto/offerings/get-prices.dto';

import { BrandQueryService } from '../../services/queries/brand-query.service';
import { PricesActionTypes, PricesLoadFailAction, PricesLoadSuccessAction } from '../actions/prices.actions';

@Injectable()
export class PricesEffects {
  constructor(private actions$: Actions,
              private brandQueryService: BrandQueryService,
              private offeringsApiQueryService: OfferingsApiQueryService) {
  }

  @Effect()
  loadPrices$ = this.actions$
    .ofType(PricesActionTypes.PricesLoadAction)
    .pipe(
      map(() => this.brandQueryService.getBrandId()),
      switchMap((brandId: string) => {
        return this.offeringsApiQueryService.getPrices(brandId)
          .pipe(
            map((prices: PricesMapDto) => new PricesLoadSuccessAction(prices)),
            catchError((error) => of(new PricesLoadFailAction(error)))
          );
      })
    );
}
