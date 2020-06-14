import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DeviceService } from '../../../../services/device/device.service';

import { DeviceType } from '../../../../services/device/entities/types/device.type';
import { BrandParamsService } from '../../../brand/services/brand-params.service';

@Component({
  selector: 'app-results-menu-list-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-results-menu-list
      class="hidden-sm-down"
      [lotteryIds]="lotteryIds$|async"
    ></app-results-menu-list>
    <app-results-menu-list-mobile
      class="hidden-md-up"
      [lotteryIds]="lotteryIds$|async"
    ></app-results-menu-list-mobile>
  `
})
export class ResultsMenuListContainerComponent implements OnInit {
  device$: Observable<DeviceType>;
  lotteryIds$: Observable<string[]>;

  constructor(private deviceService: DeviceService,
              private brandParamsService: BrandParamsService) {
  }

  ngOnInit(): void {
    this.device$ = this.deviceService.getDevice();
    this.lotteryIds$ = this.brandParamsService.getConfig('header', 'lotteryIdsResultsDropDown');
  }
}
