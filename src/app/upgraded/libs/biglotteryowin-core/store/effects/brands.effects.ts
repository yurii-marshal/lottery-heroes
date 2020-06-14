import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';

import { LuvApiQueryService } from '@libs/biglotteryowin-api/services/queries/luv-api-query.service';
import { BrandDto } from '@libs/biglotteryowin-api/dto/luv/get-brands.dto';

import { BrandsActionTypes, BrandsLoadFailAction, BrandsLoadSuccessAction } from '../actions/brands.actions';

@Injectable()
export class BrandsEffects {
  constructor(private actions$: Actions,
              private luvApiQueryService: LuvApiQueryService) {
  }

  @Effect()
  loadBrands$ = this.actions$
    .ofType(BrandsActionTypes.BrandsLoadAction)
    .pipe(
      switchMap(() => {
        return this.luvApiQueryService.getBrands()
          .pipe(
            map((brands: BrandDto[]) => new BrandsLoadSuccessAction(brands)),
            catchError((error) => of(new BrandsLoadFailAction(error)))
          );
      })
    );
}
