import { InjectionToken } from '@angular/core';

export const HOTJAR_PLUGIN_CONFIG = new InjectionToken<{[brandId: string]: object}>('hotjarPluginConfig');

export const hotjarPluginConfig = {
  BIGLOTTERYOWIN_COM: {
    hotjarId: '1087197'
  }
};
