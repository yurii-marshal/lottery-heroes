import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { TicketsPageSandbox } from './tickets-page.sandbox';

import { DeviceType } from '../../services/device/entities/types/device.type';
import { DrawInterface } from '../../modules/api/entities/incoming/lotteries/draws.interface';
import { BrandQueryService } from '@libs/biglotteryowin-core/services/queries/brand-query.service';

@Component({
  selector: 'app-tickets-page-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="upcomingDraw$|async">
      <app-tickets-page-desktop class="hidden-sm-down" [lotteryId$]="lotteryId$" [device$]="device$"></app-tickets-page-desktop>
      <app-tickets-page-mobile class="hidden-md-up" [lotteryId$]="lotteryId$" [device$]="device$"></app-tickets-page-mobile>
    </ng-container>
  `,
})
export class TicketsPageContainerComponent implements OnInit, OnDestroy {
  lotteryId$: Observable<string>;
  upcomingDraw$: Observable<DrawInterface>;
  device$: Observable<DeviceType>;

  private aliveSubscriptions = true;

  constructor(private sandbox: TicketsPageSandbox,
              private brandQueryService: BrandQueryService,
              private activatedRoute: ActivatedRoute) {
    this.lotteryId$ = this.activatedRoute.data
      .map((data: Data) => data['lotteryId'])
      .map((lotteryId: string) => {
        if (lotteryId === 'euromillions' && this.brandQueryService.getBrandId() !== 'BIGLOTTERYOWIN_UK') {
          return 'euromillions-ie';
        }

        return lotteryId;
      });
    this.upcomingDraw$ = this.lotteryId$.switchMap((lotteryId: string) => this.sandbox.getUpcomingDraw(lotteryId));
    this.device$ = this.sandbox.getDevice();
  }

  ngOnInit(): void {
    this.lotteryId$
      .takeWhile(() => this.aliveSubscriptions)
      .subscribe((lotteryId: string) => this.sandbox.setMeta(lotteryId));
  }

  ngOnDestroy(): void {
    this.aliveSubscriptions = false;
  }
}
