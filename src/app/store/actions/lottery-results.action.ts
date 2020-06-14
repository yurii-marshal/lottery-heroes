import { Action } from '@ngrx/store';

export enum LotteryResultsActionTypes {
  ShowConversionLightBox = '[Lottery Results] Open Conversion LightBox',
  ClickConversionCancel = '[Lottery Results] Click Conversion to not right now',
  ClickConversionClose = '[Lottery Results] Click Conversion to close the window',
  ClickConversionToTicketPage = '[Lottery Results] Click Conversion to proceed to the ticket page'
}

export class ShowConversionLightBox implements Action {
  readonly type = LotteryResultsActionTypes.ShowConversionLightBox;

  constructor(public payload: {lotteryName: string}) {
  }
}

export class ClickConversionCancel implements Action {
  readonly type = LotteryResultsActionTypes.ClickConversionCancel;

  constructor(public payload: {lotteryName: string}) {
  }
}

export class ClickConversionClose implements Action {
  readonly type = LotteryResultsActionTypes.ClickConversionClose;

  constructor(public payload: {lotteryName: string}) {
  }
}

export class ClickConversionToTicketPage implements Action {
  readonly type = LotteryResultsActionTypes.ClickConversionToTicketPage;

  constructor(public payload: {lotteryName: string}) {
  }
}

export type LotteryResultsActions =
  | ShowConversionLightBox
  | ClickConversionCancel
  | ClickConversionClose
  | ClickConversionToTicketPage;
