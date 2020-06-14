import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LotteryInterface } from '../../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { OfferFreeLinesInterface } from '../../../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import { LineInterface } from '../../../../../../modules/api/entities/outgoing/common/line.interface';

@Component({
  selector: 'app-biggest-jackpot-lottery-box',
  templateUrl: './biggest-jackpot-lottery-box.component.html',
  styleUrls: ['./biggest-jackpot-lottery-box.component.scss']
})
export class BiggestJackpotLotteryBoxComponent {
  @Input() biggestJackpotLottery: LotteryInterface;
  @Input() upcomingDraw: DrawInterface;
  @Input() freeLineOffer: OfferFreeLinesInterface;
  @Input() upcomingDrawLinePrice: number | null;
  @Input() lines: LineInterface[];

  @Output() redirectToCart = new EventEmitter();
}
