import { Action } from '@ngrx/store';

export enum HowToPlayActionTypes {
  ClickPlayLotteryAction = '[HowToPlay] Click play lottery',
}

export class ClickPlayLotteryAction implements Action {
  readonly type = HowToPlayActionTypes.ClickPlayLotteryAction;

  constructor(public payload: {lotteryId: string}) {
  }
}

export type HowToPlayActions =
  | ClickPlayLotteryAction;
