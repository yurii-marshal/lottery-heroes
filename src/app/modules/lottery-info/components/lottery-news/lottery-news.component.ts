import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { LotteryInterface } from '../../../api/entities/incoming/lotteries/lotteries.interface';

@Component({
  selector: 'app-lottery-news',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lottery-news.component.html',
  styleUrls: ['./lottery-news.component.scss']
})
export class LotteryNewsComponent {
  @Input() lottery: LotteryInterface;
  @Input() lotteryWordpressPosts: Array<any>;
}
