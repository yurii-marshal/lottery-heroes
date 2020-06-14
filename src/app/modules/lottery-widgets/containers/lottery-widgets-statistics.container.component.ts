import { Component, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DrawsService } from '../../../services/lotteries/draws.service';

import { LotteriesService } from '../../../services/lotteries/lotteries.service';
import { LotteryInterface } from '../../api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../api/entities/incoming/lotteries/draws.interface';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-lottery-widgets-statistics-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-lottery-widgets-statistics
      [showCaption]="showCaption"
      [fromLastJackpot]="fromLastJackpot$|async"
      [lottery]="lottery$|async"
      [pageType]="pageType"
    ></app-lottery-widgets-statistics>
  `,
})
export class LotteryWidgetsStatisticsContainerComponent implements OnInit {
  @Input() showCaption = true;
  @Input() pageType: string;
  @Input() lotteryId: string;

  fromLastJackpot$: Observable<number>;
  lottery$: Observable<LotteryInterface>;

  constructor(private drawsService: DrawsService,
              private lotteriesService: LotteriesService) {
  }

  ngOnInit(): void {
    this.lottery$ = this.lotteriesService.getLottery(this.lotteryId);
    this.fromLastJackpot$ = this.drawsService.getLastLotteryDraws(this.lotteryId)
      .pipe(
        map((lastDraws: Array<DrawInterface>) => {
          const lastDraw: DrawInterface = lastDraws[0];
          const beforeLastDraw: DrawInterface = lastDraws[1];
          return (lastDraw && beforeLastDraw) ? Math.round((lastDraw.jackpot * 100) / beforeLastDraw.jackpot - 100) : 0;
        })
      );
  }
}
