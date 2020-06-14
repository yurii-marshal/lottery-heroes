import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { BaseSandbox } from '../../shared/sandbox/base.sandbox';
import { DeviceService } from '../../services/device/device.service';
import { LotteriesService } from '../../services/lotteries/lotteries.service';
import { DrawsService } from '../../services/lotteries/draws.service';
import { MetaService } from '../../modules/meta/services/meta.service';

import * as fromRoot from '../../store/reducers/index';

@Injectable()
export class TicketsPageSandbox extends BaseSandbox {
  constructor(protected store: Store<fromRoot.State>,
              protected deviceService: DeviceService,
              protected lotteriesService: LotteriesService,
              protected drawsService: DrawsService,
              private metaService: MetaService) {
    super(store, deviceService, lotteriesService, drawsService);
  }

  setMeta(lotteryId: string): void {
    this.metaService.setFromConfig('lotteries', lotteryId);
  }
}
