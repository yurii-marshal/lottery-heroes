import { Component, ChangeDetectionStrategy, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DeviceService } from '../../../../services/device/device.service';
import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { DrawsService } from '../../../../services/lotteries/draws.service';

import { DeviceType } from '../../../../services/device/entities/types/device.type';
import { DrawInterface } from '../../../api/entities/incoming/lotteries/draws.interface';
import { LotteryInterface } from '../../../api/entities/incoming/lotteries/lotteries.interface';

@Component({
  selector: 'app-results-menu-list-item-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="(lottery$|async) && (latestDraw$|async)">
      <app-results-menu-list-item
        class="hidden-sm-down"
        [lottery]="lottery$|async"
        [latestDraw]="latestDraw$|async"
      ></app-results-menu-list-item>
      <app-results-menu-list-item-mobile
        class="hidden-md-up"
        [lottery]="lottery$|async"
        [latestDraw]="latestDraw$|async"
      ></app-results-menu-list-item-mobile>
    </ng-container>
  `
})
export class ResultsMenuListItemContainerComponent implements OnInit {
  @Input() lotteryId: string;

  device$: Observable<DeviceType>;
  lottery$: Observable<LotteryInterface>;
  latestDraw$: Observable<DrawInterface>;

  constructor(private deviceService: DeviceService,
              private lotteriesService: LotteriesService,
              private drawsService: DrawsService) {
  }

  ngOnInit() {
    this.device$ = this.deviceService.getDevice();
    this.lottery$ = this.lotteriesService.getLottery(this.lotteryId, true);
    this.latestDraw$ = this.drawsService.getLatestDraw(this.lotteryId);
  }
}
