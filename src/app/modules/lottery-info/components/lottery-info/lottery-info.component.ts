import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LotteryInterface } from '../../../api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../api/entities/incoming/lotteries/draws.interface';

@Component({
  selector: 'app-lottery-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lottery-info.component.html',
  styleUrls: ['./lottery-info.component.scss']
})
export class LotteryInfoComponent {
  @Input() lottery: LotteryInterface;
  @Input() device: string;
  @Input() lottery$: Observable<LotteryInterface>;
  @Input() lotterySlug: string;
  @Input() lotteryLatestDraw: DrawInterface;
  @Input() lotteryCountryName: string;
  @Input() lotteryJackpotOdds: number;
  @Input() lotteryWordpressPosts$: Observable<any[]>;
  @Input() upcomingDraw: DrawInterface;

  @Output() changeTabEvent = new EventEmitter<string>();

  dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  Math: any;

  constructor() {
    this.Math = Math;
  }

  setItempropAttr() {
    if (this.lottery === null) {
      return null;
    }

    return this.lottery.id === 'euromillions-ie' || this.lottery.id === 'euromillions' ||
      this.lottery.id === 'powerball' || this.lottery.id === 'megamillions' ||
      this.lottery.id === 'lotto-uk' ? 'significantLink' : null;
  }
}
