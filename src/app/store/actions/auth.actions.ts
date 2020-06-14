import { Action } from '@ngrx/store';

import { VisitorCountryInterface } from '../../services/api/entities/incoming/visitor-country.interface';

export enum AuthActionTypes {
  SetRedirectUrl = '[Auth] Set redirect url',
  SetSessionStatus = '[Auth] Set session status',
  SetVisitorCountry = '[Auth] Set visitor country',
  ClickLiveChatRegistration = '[Auth] Click fresh chat link on registration form',
  ClickContactUsRegistration = '[Auth] Click contact us link on registration form'
}

export class SetRedirectUrl implements Action {
  readonly type = AuthActionTypes.SetRedirectUrl;

  constructor(public payload: string) {
  }
}

export class SetSessionStatus implements Action {
  readonly type = AuthActionTypes.SetSessionStatus;

  constructor(public payload: string) {
  }
}

export class SetVisitorCountry implements Action {
  readonly type = AuthActionTypes.SetVisitorCountry;

  constructor(public payload: VisitorCountryInterface) {
  }
}

export class ClickLiveChatRegistration implements Action {
  readonly type = AuthActionTypes.ClickLiveChatRegistration;
}

export class ClickContactUsRegistration implements Action {
  readonly type = AuthActionTypes.ClickContactUsRegistration;
}

export type AuthActions =
  | SetRedirectUrl
  | SetVisitorCountry
  | SetSessionStatus
  | ClickLiveChatRegistration
  | ClickContactUsRegistration;
