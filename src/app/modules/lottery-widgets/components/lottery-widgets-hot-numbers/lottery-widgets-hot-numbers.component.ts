import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { LotteryInterface, LotteryStatsInterface } from '../../../api/entities/incoming/lotteries/lotteries.interface';

@Component({
  selector: 'app-lottery-widgets-hot-numbers',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lottery-widgets-hot-numbers.component.html',
  styleUrls: ['./lottery-widgets-hot-numbers.component.scss']
})
export class LotteryWidgetsHotNumbersComponent {
  @Input() lottery: LotteryInterface;
  @Input() lotteryStats: LotteryStatsInterface;
}
