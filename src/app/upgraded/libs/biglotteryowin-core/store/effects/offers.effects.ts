import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';

import { OfferingsApiQueryService } from '@libs/biglotteryowin-api/services/queries/offerings-api-query.service';
import { OffersMapDto } from '@libs/biglotteryowin-api/dto/offerings/get-offers.dto';

import { BrandQueryService } from '../../services/queries/brand-query.service';
import { OffersActionTypes, OffersLoadFailAction, OffersLoadSuccessAction } from '../actions/offers.actions';

@Injectable()
export class OffersEffects {
  constructor(private actions$: Actions,
              private brandQueryService: BrandQueryService,
              private offeringsApiQueryService: OfferingsApiQueryService) {
  }

  @Effect()
  loadOffers$ = this.actions$
    .ofType(OffersActionTypes.OffersLoadAction)
    .pipe(
      map(() => this.brandQueryService.getBrandId()),
      switchMap((brandId: string) => {
        return this.offeringsApiQueryService.getOffers(brandId)
          .pipe(
            map((offers: OffersMapDto) => new OffersLoadSuccessAction(offers)),
            catchError((error) => of(new OffersLoadFailAction(error)))
          );
      })
    );
}
