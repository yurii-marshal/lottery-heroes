import { Action } from '@ngrx/store';

import { OffersMapDto } from '@libs/biglotteryowin-api/dto/offerings/get-offers.dto';

export enum OffersActionTypes {
  OffersLoadAction = '[BiglotteryowinCore] Load offers',
  OffersLoadFailAction = '[BiglotteryowinCore] Load offers fail',
  OffersLoadSuccessAction = '[BiglotteryowinCore] Load offers success',
}

export class OffersLoadAction implements Action {
  readonly type = OffersActionTypes.OffersLoadAction;
}

export class OffersLoadFailAction implements Action {
  readonly type = OffersActionTypes.OffersLoadFailAction;

  constructor(public payload: any) {
  }
}

export class OffersLoadSuccessAction implements Action {
  readonly type = OffersActionTypes.OffersLoadSuccessAction;

  constructor(public payload: OffersMapDto) {
  }
}

export type OffersActions =
  | OffersLoadAction
  | OffersLoadFailAction
  | OffersLoadSuccessAction;
