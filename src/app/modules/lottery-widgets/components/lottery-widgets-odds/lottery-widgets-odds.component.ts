import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';

import { LotteryInterface } from '../../../api/entities/incoming/lotteries/lotteries.interface';
import { ParsedBallCombinationInterface } from '../../../../services/api/entities/incoming/lotteries/ball-combinations-map.interface';
import { LotteriesService } from '../../../../services/lotteries/lotteries.service';

@Component({
  selector: 'app-lottery-widgets-odds',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lottery-widgets-odds.component.html',
  styleUrls: ['./lottery-widgets-odds.component.scss']
})
export class LotteryWidgetsOddsComponent implements OnChanges {
  @Input() lottery: LotteryInterface;

  oddsData: Array<ParsedBallCombinationInterface>;

  constructor(private lotteriesService: LotteriesService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.lottery && this.lottery.odds) {
      this.oddsData = this.lotteriesService
        .parseBallCombinationsMap(this.lottery.odds, 'balls', this.lottery.rank_associations);
    }
  }
}
