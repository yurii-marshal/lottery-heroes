import { Action } from '@ngrx/store';

export enum HeaderActionTypes {
  ClickHandPickNumbers = '[Header] Click hand pick numbers',
  ClickSuperJackpotLottery = '[Header] Click super jackpot lottery',
  ClickQuickPick = '[Header] Click quick pick',
  ClickSelectCombo = '[Header] Click select combo',
  ClickSelectBundle = '[Header] Click select bundle',
  ClickMobileScroll = 'Click to scroll up on mobile'
}

export class ClickHandPickNumbers implements Action {
  readonly type = HeaderActionTypes.ClickHandPickNumbers;

  constructor(public payload: { lotteryName: string, menuName: string }) {
  }
}

export class ClickSuperJackpotLottery implements Action {
  readonly type = HeaderActionTypes.ClickSuperJackpotLottery;

  constructor(public payload: { lotteryName: string }) {
  }
}

export class ClickQuickPick implements Action {
  readonly type = HeaderActionTypes.ClickQuickPick;

  constructor(public payload: { lotteryName: string, menuName: string }) {
  }
}

export class ClickSelectCombo implements Action {
  readonly type = HeaderActionTypes.ClickSelectCombo;

  constructor(public payload: { comboName: string }) {

  }
}

export class ClickSelectBundle implements Action {
  readonly type = HeaderActionTypes.ClickSelectBundle;

  constructor(public payload: { bundleName: string }) {

  }
}

export class ClickMobileScroll implements Action {
  readonly type = HeaderActionTypes.ClickMobileScroll;
}

export type HeaderActions =
  | ClickHandPickNumbers
  | ClickSuperJackpotLottery
  | ClickQuickPick
  | ClickSelectCombo
  | ClickSelectBundle
  | ClickMobileScroll;
