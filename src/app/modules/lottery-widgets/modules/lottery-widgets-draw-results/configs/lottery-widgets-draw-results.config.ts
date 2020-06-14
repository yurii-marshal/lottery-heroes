import { InjectionToken } from '@angular/core';

export const LOTTERY_WIDGETS_DRAW_RESULTS_CONFIG = new InjectionToken<{[brandId: string]: object}>('lotteryWidgetsDrawResultsConfig');

export const lotteryWidgetsDrawResultsConfig = {
  BIGLOTTERYOWIN_COM: {
    drawDateFormat: 'EEEE, MMM d, y',
    drawDateText: 'draw',
    defaultHeading: true,
  }
};
