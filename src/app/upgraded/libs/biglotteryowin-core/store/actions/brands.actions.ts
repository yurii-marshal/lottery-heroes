import { Action } from '@ngrx/store';

import { BrandDto } from '@libs/biglotteryowin-api/dto/luv/get-brands.dto';

export enum BrandsActionTypes {
  BrandsLoadAction = '[BiglotteryowinCore] Load brands',
  BrandsLoadFailAction = '[BiglotteryowinCore] Load brands fail',
  BrandsLoadSuccessAction = '[BiglotteryowinCore] Load brands success',
}

export class BrandsLoadAction implements Action {
  readonly type = BrandsActionTypes.BrandsLoadAction;
}

export class BrandsLoadFailAction implements Action {
  readonly type = BrandsActionTypes.BrandsLoadFailAction;

  constructor(public payload: any) {
  }
}

export class BrandsLoadSuccessAction implements Action {
  readonly type = BrandsActionTypes.BrandsLoadSuccessAction;

  constructor(public payload: BrandDto[]) {
  }
}

export type BrandsActions =
  | BrandsLoadAction
  | BrandsLoadFailAction
  | BrandsLoadSuccessAction;
