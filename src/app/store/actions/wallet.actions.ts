import { Action } from '@ngrx/store';

export enum WalletActionTypes {
  SetSkipFirstDrawParam = '[Wallet] Set skip first draw param',
}

export class SetSkipFirstDrawParam implements Action {
  readonly type = WalletActionTypes.SetSkipFirstDrawParam;

  constructor(public payload: string | null) {
  }
}

export type WalletActions =
  | SetSkipFirstDrawParam;
