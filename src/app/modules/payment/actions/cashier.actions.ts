import { Action } from '@ngrx/store';

export enum CashierActionTypes {
  ClickLiveChat = '[Cashier] Click live chat link',
  ClickSupportEmail = '[Cashier] Click support email address link',
  ClickNewPlayingLimit = '[Cashier] Click new playing limit link'
}

export class ClickLiveChat implements Action {
  readonly type = CashierActionTypes.ClickLiveChat;
}

export class ClickSupportEmail implements Action {
  readonly type = CashierActionTypes.ClickSupportEmail;
}

export class ClickNewPlayingLimit implements Action {
  readonly type = CashierActionTypes.ClickNewPlayingLimit;
}

export type CartActions =
  | ClickLiveChat
  | ClickSupportEmail
  | ClickNewPlayingLimit;
