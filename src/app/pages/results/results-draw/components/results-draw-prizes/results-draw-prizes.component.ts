import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';

import { DeviceType } from '../../../../../services/device/entities/types/device.type';

import { ParsedBallCombinationInterface } from '../../../../../services/api/entities/incoming/lotteries/ball-combinations-map.interface';
import { DrawInterface } from '../../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { LotteryInterface } from '../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';

import { ArraysUtil } from '../../../../../modules/shared/utils/arrays.util';
import { LotteriesService } from '../../../../../services/lotteries/lotteries.service';

@Component({
  selector: 'app-results-draw-prizes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './results-draw-prizes.component.html',
  styleUrls: ['./results-draw-prizes.component.scss']
})
export class ResultsDrawPrizesComponent implements OnChanges {
  @Input() lottery: LotteryInterface;
  @Input() draw: DrawInterface;
  @Input() upcomingDraw: DrawInterface;
  @Input() jackpotCurrencySymbol: string;
  @Input() device: DeviceType;

  prizesData: Array<ParsedBallCombinationInterface>;
  winnersData: Array<ParsedBallCombinationInterface>;

  constructor(private lotteriesService: LotteriesService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.prizesData = this.draw.prizes ? this.lotteriesService
      .parseBallCombinationsMap(this.draw.prizes, 'balls', this.lottery.rank_associations) : null;

    this.winnersData = this.draw.winners ? this.lotteriesService
      .parseBallCombinationsMap(this.draw.winners, 'balls') : null;
  }

  getWinnersVal(key: string): number {
    const prizeItem: ParsedBallCombinationInterface = ArraysUtil.findObjByKeyValue(this.winnersData, 'key', key);
    return prizeItem ? prizeItem.val : null;
  }
}
