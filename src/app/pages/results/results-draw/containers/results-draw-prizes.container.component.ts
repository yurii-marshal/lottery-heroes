import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map, switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { DrawsService } from '../../../../services/lotteries/draws.service';
import { DeviceService } from '../../../../services/device/device.service';

import { DeviceType } from '../../../../services/device/entities/types/device.type';

import { LuvCurrencyInterface } from '../../../../services/api/entities/incoming/luv/luv-currencies.interface';
import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { LuvService } from '../../../../services/luv.service';
import { DrawInterface } from '../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { LotteryInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';

@Component({
  selector: 'app-results-draw-prizes-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-results-draw-prizes
      [lottery]="lottery$|async"
      [draw]="draw$|async"
      [upcomingDraw]="upcomingDraw$|async"
      [jackpotCurrencySymbol]="jackpotCurrencySymbol$|async"
      [device]="device$|async"
    ></app-results-draw-prizes>
  `,
})
export class ResultsDrawPrizesContainerComponent implements OnInit {
  lottery$: Observable<LotteryInterface>;
  draw$: Observable<DrawInterface>;
  device$: Observable<DeviceType>;
  upcomingDraw$: Observable<DrawInterface>;
  jackpotCurrencySymbol$: Observable<string>;

  constructor(private activatedRoute: ActivatedRoute,
              private drawsService: DrawsService,
              private lotteriesService: LotteriesService,
              private luvService: LuvService,
              private deviceService: DeviceService) {
  }

  ngOnInit(): void {

    const lotteryId$ = this.activatedRoute.data.pipe(
      map((data: Data) => data['lotteryId'])
    );
    const dateLocal$ = this.activatedRoute.params.pipe(
      map((params: Params) => params['dateLocal'])
    );

    this.lottery$ = lotteryId$.pipe(
      switchMap(lotteryId => this.lotteriesService.getLottery(lotteryId))
    );

    this.draw$ = combineLatest(lotteryId$, dateLocal$).pipe(
      switchMap(data => this.drawsService.getDrawByDate(data[0], data[1]))
    );

    this.upcomingDraw$ = lotteryId$.switchMap((lotteryId: string) => this.drawsService.getUpcomingDraw(lotteryId));

    this.jackpotCurrencySymbol$ = lotteryId$.pipe(
      switchMap((lotteryId: string) => this.lotteriesService.getLottery(lotteryId)),
      switchMap((lottery: LotteryInterface) => this.luvService.getCurrencies()
        .pipe(
          map((currencies: Array<LuvCurrencyInterface>) =>
            LuvService.findCurrencySymbolInCurrencies(currencies, lottery.currency_id)))
      ));

    this.device$ = this.deviceService.getDevice();
  }
}

