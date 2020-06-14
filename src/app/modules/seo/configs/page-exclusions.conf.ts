import { InjectionToken } from '@angular/core';

export const PAGE_EXCLUSIONS_CONFIG = new InjectionToken<{[brandId: string]: any[]}>('PageExclusionsConfig');

export const pageExclusionsConfig = {
  BIGLOTTERYOWIN_COM: {
    slugExclusions: [
      '^\/[^/]+\/how-to-play$',
      '/about/bet-vs-play',
      '/safe-and-secure',
      '^\/euromillions\/results\/(2016|2017-(01|02)|2017-03-(03|07|10|14|17))',
    ]
  }
};
