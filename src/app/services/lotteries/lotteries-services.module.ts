import { ModuleWithProviders, NgModule } from '@angular/core';

import { LotteriesService } from './lotteries.service';
import { DrawsService } from './draws.service';
import { LotteriesSortService } from './lotteries-sort.service';
import { AltService } from './alt.service';
import { LuckyNumbersService } from './lucky-numbers.service';
import { LotteryNotificationService } from './entities/lottery-notification.service';

@NgModule()
export class LotteriesServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LotteriesServicesModule,
      providers: [
        LotteriesService,
        DrawsService,
        LotteriesSortService,
        AltService,
        LuckyNumbersService,
        LotteryNotificationService
      ]
    };
  }
}
