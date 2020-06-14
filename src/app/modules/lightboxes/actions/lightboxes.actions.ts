import { Action } from '@ngrx/store';

export enum LightboxesActionsTypes {
  LightboxPopup = '[Lightboxes] Lightbox popup',
  RedirectionLightboxRedirected = '[Lightboxes] Redirection lightbox redirected',
  RedirectionLightboxClickStay = '[Lightboxes] Redirection lightbox cLick stay'
}

export class LightboxPopup implements Action {
  readonly type = LightboxesActionsTypes.LightboxPopup;

  constructor(public payload: { lightboxName: string }) {
  }
}

export class RedirectionLightboxRedirected implements Action {
  readonly type = LightboxesActionsTypes.RedirectionLightboxRedirected;
}

export class RedirectionLightboxClickStay implements Action {
  readonly type = LightboxesActionsTypes.RedirectionLightboxClickStay;
}

export type LightboxesActions =
  | LightboxPopup
  | RedirectionLightboxRedirected
  | RedirectionLightboxClickStay;
