import { Action } from '@ngrx/store';

export enum WindowActionsTypes {
  NavigateBack = '[Window] Navigate back'
}

export class NavigateBack implements Action {
  readonly type = WindowActionsTypes.NavigateBack;

  constructor(public payload: { url: string }) {
  }
}

export type WindowActions =
  | NavigateBack;
