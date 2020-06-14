import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { LotteryInterface } from '../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';

@Component({
  selector: 'app-results-lottery-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './results-lottery-title.component.html',
  styleUrls: ['./results-lottery-title.component.scss']
})
export class ResultsLotteryTitleComponent {
  @Input() lottery: LotteryInterface;
}
