import { InjectionToken } from '@angular/core';

export const LOTTERIES_ITEM_CONFIG = new InjectionToken<{[key: string]: any}>('lotteriesItemConfig');

export const lotteriesItemConfig = {
  significantLinkLotteryIds: [
    'euromillions-ie',
    'euromillions',
    'powerball',
    'megamillions',
    'lotto-uk',
  ]
};
