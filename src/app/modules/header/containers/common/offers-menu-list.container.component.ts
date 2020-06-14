import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LotteriesSortService } from '../../../../services/lotteries/lotteries-sort.service';
import { DeviceType } from '../../../../services/device/entities/types/device.type';
import { DeviceService } from '../../../../services/device/device.service';

@Component({
  selector: 'app-offers-menu-list-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-offers-menu-list
			*ngIf="(device$|async) === 'desktop'"
			class="hidden-sm-down"
      [lotteryIds]="lotteryIds$|async"
    ></app-offers-menu-list>
		<app-offers-menu-list-mobile
			*ngIf="(device$|async) === 'mobile'"
			class="hidden-md-up"
			[lotteryIds]="lotteryIds$|async"
		></app-offers-menu-list-mobile>
  `
})
export class OffersMenuListContainerComponent implements OnInit {
  lotteryIds$: Observable<string[]>;
  device$: Observable<DeviceType>;

  constructor(private deviceService: DeviceService,
              private lotteriesSortService: LotteriesSortService) {
  }

  ngOnInit(): void {
    this.device$ = this.deviceService.getDevice();
    this.lotteryIds$ = this.lotteriesSortService.getOffersLotteryIds().map(ids => ids);
  }
}
