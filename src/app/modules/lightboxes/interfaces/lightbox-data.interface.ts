export interface LightboxDataInterface {
  type: string;
  payload?: any;
  title?: string;
  message?: string;
  buttons?: Array<LightboxDataButtonInterface>;
  closeHandler?: Function;
}

export interface LightboxDataButtonInterface {
  text?: string;
  type?: string;
  handler?: Function;
}
