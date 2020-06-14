import { Action } from '@ngrx/store';

import { DrawDto } from '@libs/biglotteryowin-api/dto/lotteries/draw.dto';
import { SingleDrawDto } from '@libs/biglotteryowin-api/dto/lotteries/single-draw.dto';

export enum DrawsActionTypes {
  UpcomingDrawsLoadAction = '[BiglotteryowinCore] Load upcoming draws',
  UpcomingDrawsLoadFailAction = '[BiglotteryowinCore] Load upcoming draws fail',
  UpcomingDrawsLoadSuccessAction = '[BiglotteryowinCore] Load upcoming draws success',

  LatestDrawsLoadAction = '[BiglotteryowinCore] Load latest draws',
  LatestDrawsLoadFailAction = '[BiglotteryowinCore] Load latest draws fail',
  LatestDrawsLoadSuccessAction = '[BiglotteryowinCore] Load latest draws success',

  DrawsByIdLoadAction = '[BiglotteryowinCore] Load draws by id',
  DrawsByIdLoadFailAction = '[BiglotteryowinCore] Load draws by id fail',
  DrawsByIdLoadSuccessAction = '[BiglotteryowinCore] Load draws by id success',

  DrawByDateLocalLoadAction = '[BiglotteryowinCore] Load draw by date local',
  DrawByDateLocalLoadFailAction = '[BiglotteryowinCore] Load draw by date local fail',
  DrawByDateLocalLoadSuccessAction = '[BiglotteryowinCore] Load draw by date local success',
}

/**
 * UPCOMING DRAWS
 */

export class UpcomingDrawsLoadAction implements Action {
  readonly type = DrawsActionTypes.UpcomingDrawsLoadAction;
}

export class UpcomingDrawsLoadFailAction implements Action {
  readonly type = DrawsActionTypes.UpcomingDrawsLoadFailAction;

  constructor(public payload: any) {
  }
}

export class UpcomingDrawsLoadSuccessAction implements Action {
  readonly type = DrawsActionTypes.UpcomingDrawsLoadSuccessAction;

  constructor(public payload: DrawDto[]) {
  }
}

/**
 * LATEST DRAWS
 */

export class LatestDrawsLoadAction implements Action {
  readonly type = DrawsActionTypes.LatestDrawsLoadAction;
}

export class LatestDrawsLoadFailAction implements Action {
  readonly type = DrawsActionTypes.LatestDrawsLoadFailAction;

  constructor(public payload: any) {
  }
}

export class LatestDrawsLoadSuccessAction implements Action {
  readonly type = DrawsActionTypes.LatestDrawsLoadSuccessAction;

  constructor(public payload: DrawDto[]) {
  }
}

/**
 * DRAWS BY ID
 */

export class DrawsByIdLoadAction implements Action {
  readonly type = DrawsActionTypes.DrawsByIdLoadAction;

  constructor(public payload: number[]) {
  }
}

export class DrawsByIdLoadFailAction implements Action {
  readonly type = DrawsActionTypes.DrawsByIdLoadFailAction;

  constructor(public payload: any) {
  }
}

export class DrawsByIdLoadSuccessAction implements Action {
  readonly type = DrawsActionTypes.DrawsByIdLoadSuccessAction;

  constructor(public payload: DrawDto[]) {
  }
}

/**
 * DRAW BY DATE LOCAL
 */

export class DrawByDateLocalLoadAction implements Action {
  readonly type = DrawsActionTypes.DrawByDateLocalLoadAction;

  /**
   * dateLocal in format 'YYYY-MM-DD'
   */
  constructor(public payload: {lotteryId: string; dateLocal: string}) {
  }
}

export class DrawByDateLocalLoadFailAction implements Action {
  readonly type = DrawsActionTypes.DrawByDateLocalLoadFailAction;

  constructor(public payload: any) {
  }
}

export class DrawByDateLocalLoadSuccessAction implements Action {
  readonly type = DrawsActionTypes.DrawByDateLocalLoadSuccessAction;

  constructor(public payload: SingleDrawDto) {
  }
}

export type DrawsActions =
  | UpcomingDrawsLoadAction
  | UpcomingDrawsLoadFailAction
  | UpcomingDrawsLoadSuccessAction
  | LatestDrawsLoadAction
  | LatestDrawsLoadFailAction
  | LatestDrawsLoadSuccessAction
  | DrawsByIdLoadAction
  | DrawsByIdLoadFailAction
  | DrawsByIdLoadSuccessAction
  | DrawByDateLocalLoadAction
  | DrawByDateLocalLoadFailAction
  | DrawByDateLocalLoadSuccessAction;
