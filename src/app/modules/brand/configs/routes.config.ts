import { InjectionToken } from '@angular/core';

export const RoutesConfig = new InjectionToken('RoutesConfig');
export const routesConfig = process.env.NODE_ENV === 'webpack' ? {} : {
  BIGLOTTERYOWIN_COM: [
  ]
};
