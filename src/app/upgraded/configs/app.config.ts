import { InjectionToken } from '@angular/core';

export const APP_CONFIG = new InjectionToken<{[brandId: string]: object}>('appConfig');

export const appConfig = {
  BIGLOTTERYOWIN_COM: {
    facebookUrl: 'https://www.facebook.com/BIGLOTTERYOWIN/',
    twitterUrl: 'https://twitter.com/BIGLOTTERYOWIN',
  }
};
