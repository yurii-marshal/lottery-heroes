import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { AltService } from '../../../../../../services/lotteries/alt.service';
import { LotteriesService } from '../../../../../../services/lotteries/lotteries.service';

import { LotteryInterface } from '../../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../../../../modules/api/entities/incoming/lotteries/draws.interface';

@Component({
  selector: 'app-better-odds-offer-box',
  templateUrl: './better-odds-offer-box.component.html',
  styleUrls: ['./better-odds-offer-box.component.scss']
})
export class BetterOddsOfferBoxComponent implements OnChanges {

  @Input() lottery: LotteryInterface;
  @Input() betterOddsLottery: {lottery: LotteryInterface, betterOdd: number};
  @Input() betterOddsLotteryUpcomingDraw: DrawInterface;
  @Input() betterOddsLotteryLinePrice: number;
  @Output() redirectToCart = new EventEmitter();

  currentLotteryOdd: number;
  altName: string;

  constructor(private altService: AltService,
              private lotteriesService: LotteriesService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['lottery'] && changes['lottery'].currentValue) {
      this.currentLotteryOdd = this.lotteriesService.parseBallCombinationsMap(this.lottery.odds, 'valAsc')[0].val;
    }

    if (changes['betterOddsLottery'] && changes['betterOddsLottery'].currentValue) {
      this.altName = this.altService.getAlt(this.betterOddsLottery.lottery.id);
    }
  }

}
