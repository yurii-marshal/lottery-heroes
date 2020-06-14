import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { LotteryInterface } from '../../../api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../api/entities/incoming/lotteries/draws.interface';

@Component({
  selector: 'app-lottery-widgets-before-cutoff',
  templateUrl: './lottery-widgets-before-cutoff.component.html',
  styleUrls: ['./lottery-widgets-before-cutoff.component.scss']
})
export class LotteryWidgetsBeforeCutoffComponent implements OnInit {
  @Input() lottery: LotteryInterface;
  @Input() upcomingDraw: DrawInterface;
  @Input() isFreeLine: boolean;
  @Input() lineToQualify: number;
  @Input() linesFree: number;
  @Input() lotteryLinePrice: number;
  @Input() defaultNumberOfLines: number;

  @Output() closeCutoffLightBox = new EventEmitter<string>();
  @Output() addDefiniteItemsToCartEvent = new EventEmitter();

  linesAmount: number;

  ngOnInit() {
    this.isFreeLine ? this.linesAmount = this.lineToQualify : this.linesAmount = this.defaultNumberOfLines;
  }
}
