import { Action } from '@ngrx/store';

export enum RealTimeNotificationsActionsTypes {
  ClickKeepMeUpdated = '[Real Time Notifications] Click Keep me updated'
}

export class ClickKeepMeUpdated implements Action {
  readonly type = RealTimeNotificationsActionsTypes.ClickKeepMeUpdated;

  constructor(public payload: { url: string }) {
  }
}

export type RealTimeNotificationsActions =
  | ClickKeepMeUpdated;
