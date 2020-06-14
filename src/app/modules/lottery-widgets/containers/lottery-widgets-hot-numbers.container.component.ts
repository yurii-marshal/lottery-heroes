import { Component, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

import { LotteriesService } from '../../../services/lotteries/lotteries.service';
import { LotteryInterface, LotteryStatsInterface } from '../../api/entities/incoming/lotteries/lotteries.interface';

@Component({
  selector: 'app-lottery-widgets-hot-numbers-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-lottery-widgets-hot-numbers
      [lotteryStats]="lotteryStats$|async"
      [lottery]="lottery$|async"
    ></app-lottery-widgets-hot-numbers>
  `,
})
export class LotteryWidgetsHotNumbersContainerComponent implements OnInit {
  @Input() lotteryId: string;

  lottery$: Observable<LotteryInterface>;
  lotteryStats$: Observable<LotteryStatsInterface>;

  constructor(private activatedRoute: ActivatedRoute,
              private lotteriesService: LotteriesService) {
  }

  ngOnInit(): void {
    this.lottery$ = this.lotteriesService.getLottery(this.lotteryId);
    this.lotteryStats$ = this.lotteriesService.getLotteryStats(this.lotteryId);
  }
}
