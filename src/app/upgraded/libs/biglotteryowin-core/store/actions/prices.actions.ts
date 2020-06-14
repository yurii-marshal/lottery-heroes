import { Action } from '@ngrx/store';

import { PricesMapDto } from '@libs/biglotteryowin-api/dto/offerings/get-prices.dto';

export enum PricesActionTypes {
  PricesLoadAction = '[BiglotteryowinCore] Load prices',
  PricesLoadFailAction = '[BiglotteryowinCore] Load prices fail',
  PricesLoadSuccessAction = '[BiglotteryowinCore] Load prices success',
}

export class PricesLoadAction implements Action {
  readonly type = PricesActionTypes.PricesLoadAction;
}

export class PricesLoadFailAction implements Action {
  readonly type = PricesActionTypes.PricesLoadFailAction;

  constructor(public payload: any) {
  }
}

export class PricesLoadSuccessAction implements Action {
  readonly type = PricesActionTypes.PricesLoadSuccessAction;

  constructor(public payload: PricesMapDto) {
  }
}

export type PricesActions =
  | PricesLoadAction
  | PricesLoadFailAction
  | PricesLoadSuccessAction;
