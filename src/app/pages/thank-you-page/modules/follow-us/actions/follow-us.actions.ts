import { Action } from '@ngrx/store';

export enum FollowUsActionsTypes {
  ClickFollowUs = '[Follow Us] Click Follow us'
}

export class ClickFollowUs implements Action {
  readonly type = FollowUsActionsTypes.ClickFollowUs;

  constructor(public payload: { url: string }) {
  }
}

export type FollowUsActions =
  | ClickFollowUs;
