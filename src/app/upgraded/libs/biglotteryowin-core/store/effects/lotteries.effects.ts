import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';

import { LotteriesApiQueryService } from '@libs/biglotteryowin-api/services/queries/lotteries-api-query.service';
import { LotteryDto } from '@libs/biglotteryowin-api/dto/lotteries/get-lotteries.dto';

import { BrandQueryService } from '../../services/queries/brand-query.service';
import { LotteriesActionTypes, LotteriesLoadFailAction, LotteriesLoadSuccessAction } from '../actions/lotteries.actions';

@Injectable()
export class LotteriesEffects {
  constructor(private actions$: Actions,
              private brandQueryService: BrandQueryService,
              private lotteriesApiQueryService: LotteriesApiQueryService) {
  }

  @Effect()
  loadLotteries$ = this.actions$
    .ofType(LotteriesActionTypes.LotteriesLoadAction)
    .pipe(
      map(() => this.brandQueryService.getBrandId()),
      switchMap((brandId: string) => {
        return this.lotteriesApiQueryService.getLotteries(brandId)
          .pipe(
            map((lotteries: LotteryDto[]) => new LotteriesLoadSuccessAction(lotteries)),
            catchError((error) => of(new LotteriesLoadFailAction(error)))
          );
      })
    );
}
