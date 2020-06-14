import { InjectionToken } from '@angular/core';

export const SCHEMA_PLUGIN_CONFIG = new InjectionToken<{[brandId: string]: object}>('schemaPluginConfig');

export const schemaPluginConfig = {
  BIGLOTTERYOWIN_COM: {
    name: 'BIGLOTTERYOWIN',
    alternateName: 'BIGLOTTERYOWIN',
    description: 'Play the biggest lottery jackpots from around the world with BIGLOTTERYOWIN! ' +
    'Winning the lottery was always a dream? With one small step it can be your reality!',
    logo: '/assets/images/header/biglottery_logo.svg',
    telephone: '+44 xxx xxxx xxx',
    areaServed: ''
  }
};
