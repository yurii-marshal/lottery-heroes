import { Action } from '@ngrx/store';
import { NavigationExtras, Params } from '@angular/router';

export enum RouterActionTypes {
  RouterGoAction = '[RouterStore] Go',
  RouterBackAction = '[RouterStore] Back',
  RouterForwardAction = '[RouterStore] Forward',
}

export class RouterGoAction implements Action {
  readonly type = RouterActionTypes.RouterGoAction;

  constructor(public payload: {
    path: any[];
    queryParams?: Params | null;
    extras?: NavigationExtras;
  }) {
  }
}

export class RouterBackAction implements Action {
  readonly type = RouterActionTypes.RouterBackAction;
}

export class RouterForwardAction implements Action {
  readonly type = RouterActionTypes.RouterForwardAction;
}

export type RouterActions = RouterGoAction | RouterBackAction | RouterForwardAction;
