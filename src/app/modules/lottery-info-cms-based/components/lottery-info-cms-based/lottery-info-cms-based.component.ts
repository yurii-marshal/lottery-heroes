import { Component, Input } from '@angular/core';
import { LotteryInterface } from '../../../api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../api/entities/incoming/lotteries/draws.interface';


@Component({
  selector: 'app-lottery-info-cms-based',
  templateUrl: './lottery-info-cms-based.component.html',
  styleUrls: ['./lottery-info-cms-based.component.scss']
})
export class LotteryInfoCmsBasedComponent {

  @Input() lottery: LotteryInterface;
  @Input() lotterySlug: string;
  @Input() lotteryLatestDraw: DrawInterface;
  @Input() cms: any;

  @Input() showBox1: boolean;
  @Input() showBox2: boolean;
  @Input() showBox3: boolean;

  setItemPropAttr() {
    return this.lottery.id === 'euromillions-ie' || this.lottery.id === 'euromillions' ||
    this.lottery.id === 'powerball' || this.lottery.id === 'megamillions' ||
    this.lottery.id === 'lotto-uk' ? 'significantLink' : null;
  }
}
