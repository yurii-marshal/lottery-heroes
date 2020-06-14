import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../../store/reducers/index';

import { DeviceService } from '../../services/device/device.service';
import { LotteriesService } from '../../services/lotteries/lotteries.service';
import { DrawsService } from '../../services/lotteries/draws.service';

import { DeviceType } from '../../services/device/entities/types/device.type';
import { LotteriesMapInterface } from '../../services/lotteries/entities/interfaces/lotteries-map.interface';
import { LotteryInterface, LotteryRulesInterface } from '../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../modules/api/entities/incoming/lotteries/draws.interface';

export abstract class BaseSandbox {
  constructor(protected store: Store<fromRoot.State>,
              protected deviceService: DeviceService,
              protected lotteriesService: LotteriesService,
              protected drawsService: DrawsService) {
  }

  getDevice(): Observable<DeviceType> {
    return this.deviceService.getDevice();
  }

  getLottery(lotteryId: string): Observable<LotteryInterface> {
    return this.lotteriesService.getLottery(lotteryId);
  }

  getLotteryRules(lotteryId: string): Observable<LotteryRulesInterface> {
    return this.lotteriesService.getLotteryRules(lotteryId);
  }

  getUpcomingDraw(lotteryId: string): Observable<DrawInterface> {
    return this.drawsService.getUpcomingDraw(lotteryId);
  }

  getLotteriesMap$(): Observable<LotteriesMapInterface> {
    return this.lotteriesService.getSoldLotteriesMap();
  }
}
