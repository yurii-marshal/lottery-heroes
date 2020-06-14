import { Action } from '@ngrx/store';

export enum DepositActionsTypes {
  DepositSuccess = '[Deposit] Deposit success',
  DepositSubmitted = '[Deposit] Deposit submitted'
}

export class DepositSuccess implements Action {
  readonly type = DepositActionsTypes.DepositSuccess;
}

export class DepositSubmitted implements Action {
  readonly type = DepositActionsTypes.DepositSubmitted;

  constructor(public payload: { label: string }) {
  }
}

export type DepositActions =
  | DepositSuccess
  | DepositSubmitted;
