import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { LotteryInterface } from '../../../api/entities/incoming/lotteries/lotteries.interface';

@Component({
  selector: 'app-lottery-widgets-statistics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lottery-widgets-statistics.component.html',
  styleUrls: ['./lottery-widgets-statistics.component.scss']
})
export class LotteryWidgetsStatisticsComponent {
  @Input() showCaption: boolean;
  @Input() fromLastJackpot: number;
  @Input() lottery: LotteryInterface;
  @Input() pageType: string;
}
