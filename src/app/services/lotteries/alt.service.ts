import { Injectable } from '@angular/core';

import { altMap } from './entities/interfaces/lotteries-alt-map.interface';

@Injectable()
export class AltService {
  getAlt(lotteryId: string): string {
    return altMap[lotteryId];
  }
}
