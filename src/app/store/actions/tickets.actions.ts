import { Action } from '@ngrx/store';
import { LineInterface } from '../../modules/api/entities/outgoing/common/line.interface';

export enum TicketsActionTypes {
  SelectLotteryId = '[Tickets] Select lottery id',

  SetLotteryTickets = '[Tickets] Set lottery tickets',
  AddLotteryTickets = '[Tickets] Add lottery tickets',
  UpdateLotteryTickets = '[Tickets] Update lottery tickets',
  DeleteLotteryTickets = '[Tickets] Delete lottery tickets',

  SetEditedTicket = '[Tickets] Set edited ticket',
  DeleteEditedTicket = '[Tickets] Delete edited ticket',

  SetLuckyNumbersLineStatus = '[Tickets] Set lucky numbers ticket status',

  ChangeRenewPeriod = '[Tickets] Change renew period',

  ClickPickYourOwnMobile = '[Tickets] Click pick your own button mobile',
  ClickFreeLineMobile = '[Tickets] Click free line button mobile',
  ClickEditLineMobile = '[Tickets] Click edit line mobile',

  ClickOtherLotteriesLink = '[Tickets] Click link in other lotteries section'
}

export class SelectLotteryIdAction implements Action {
  readonly type = TicketsActionTypes.SelectLotteryId;

  constructor(public payload: string | null) {
  }
}

export class SetLotteryTickets implements Action {
  readonly type = TicketsActionTypes.SetLotteryTickets;

  constructor(public payload: {
    lotteryId: string;
    tickets: Array<LineInterface>;
  }) {
  }
}

export class AddLotteryTickets implements Action {
  readonly type = TicketsActionTypes.AddLotteryTickets;

  constructor(public payload: {
    lotteryId: string;
    tickets: Array<LineInterface>;
  }) {
  }
}

export class UpdateLotteryTickets implements Action {
  readonly type = TicketsActionTypes.UpdateLotteryTickets;

  constructor(public payload: {
    lotteryId: string;
    tickets: Array<LineInterface>;
  }) {
  }
}

export class DeleteLotteryTickets implements Action {
  readonly type = TicketsActionTypes.DeleteLotteryTickets;

  constructor(public payload: {
    lotteryId: string;
    tickets: Array<LineInterface>;
  }) {
  }
}

export class SetEditedTicket implements Action {
  readonly type = TicketsActionTypes.SetEditedTicket;

  constructor(public payload: {
    lotteryId: string;
    ticket: LineInterface;
  }) {
  }
}

export class DeleteEditedTicket implements Action {
  readonly type = TicketsActionTypes.DeleteEditedTicket;

  constructor(public payload: {
    lotteryId: string;
  }) {
  }
}

export class SetLuckyNumbersLineStatus implements Action {
  readonly type = TicketsActionTypes.SetLuckyNumbersLineStatus;

  constructor(public payload: {
    lotteryId: string;
    lineId: string;
    status: boolean;
  }) {
  }
}

export class ChangeRenewPeriod implements Action {
  readonly type = TicketsActionTypes.ChangeRenewPeriod;

  constructor(public payload: {
    label: string;
    value: string;
  }) {
  }
}

export class ClickPickYourOwnMobile implements Action {
  readonly type = TicketsActionTypes.ClickPickYourOwnMobile;

  constructor(public payload: { lineNumber: number }) {
  }
}

export class ClickFreeLineMobile implements Action {
  readonly type = TicketsActionTypes.ClickFreeLineMobile;

  constructor(public payload: { numberOfLines: number }) {
  }
}

export class ClickEditLineMobile implements Action {
  readonly type = TicketsActionTypes.ClickEditLineMobile;

  constructor(public payload: { numberOfLine: number }) {
  }
}

export class ClickOtherLotteriesLink implements Action {
  readonly type = TicketsActionTypes.ClickOtherLotteriesLink;

  constructor(public payload: { lotteryName: string }) {
  }
}

export type TicketsActions =
  | SelectLotteryIdAction

  | SetLotteryTickets
  | AddLotteryTickets
  | UpdateLotteryTickets
  | DeleteLotteryTickets

  | SetEditedTicket
  | DeleteEditedTicket

  | SetLuckyNumbersLineStatus

  | ChangeRenewPeriod

  | ClickPickYourOwnMobile
  | ClickFreeLineMobile
  | ClickEditLineMobile

  | ClickOtherLotteriesLink;
