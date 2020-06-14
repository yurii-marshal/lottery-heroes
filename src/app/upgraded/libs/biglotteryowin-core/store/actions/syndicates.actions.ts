import { Action } from '@ngrx/store';

import { SyndicateDto } from '@libs/biglotteryowin-api/dto/offerings/get-syndicates.dto';

export enum SyndicatesActionTypes {
  SyndicatesLoadAction = '[BiglotteryowinCore] Load syndicates',
  SyndicatesLoadFailAction = '[BiglotteryowinCore] Load syndicates fail',
  SyndicatesLoadSuccessAction = '[BiglotteryowinCore] Load syndicates success',
}

export class SyndicatesLoadAction implements Action {
  readonly type = SyndicatesActionTypes.SyndicatesLoadAction;
}

export class SyndicatesLoadFailAction implements Action {
  readonly type = SyndicatesActionTypes.SyndicatesLoadFailAction;

  constructor(public payload: any) {
  }
}

export class SyndicatesLoadSuccessAction implements Action {
  readonly type = SyndicatesActionTypes.SyndicatesLoadSuccessAction;

  constructor(public payload: SyndicateDto[]) {
  }
}

export type SyndicatesActions =
  | SyndicatesLoadAction
  | SyndicatesLoadFailAction
  | SyndicatesLoadSuccessAction;
