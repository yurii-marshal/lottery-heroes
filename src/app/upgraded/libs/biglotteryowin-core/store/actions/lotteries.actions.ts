import { Action } from '@ngrx/store';

import { LotteryDto } from '@libs/biglotteryowin-api/dto/lotteries/get-lotteries.dto';

export enum LotteriesActionTypes {
  LotteriesLoadAction = '[BiglotteryowinCore] Load lotteries',
  LotteriesLoadFailAction = '[BiglotteryowinCore] Load lotteries fail',
  LotteriesLoadSuccessAction = '[BiglotteryowinCore] Load lotteries success',
}

export class LotteriesLoadAction implements Action {
  readonly type = LotteriesActionTypes.LotteriesLoadAction;
}

export class LotteriesLoadFailAction implements Action {
  readonly type = LotteriesActionTypes.LotteriesLoadFailAction;

  constructor(public payload: any) {
  }
}

export class LotteriesLoadSuccessAction implements Action {
  readonly type = LotteriesActionTypes.LotteriesLoadSuccessAction;

  constructor(public payload: LotteryDto[]) {
  }
}

export type LotteriesActions =
  | LotteriesLoadAction
  | LotteriesLoadFailAction
  | LotteriesLoadSuccessAction;
