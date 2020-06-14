import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DrawInterface } from '../../../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { LotteryInterface } from '../../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { LineInterface } from '../../../../../../modules/api/entities/outgoing/common/line.interface';

@Component({
  selector: 'app-buy-same-line-box',
  templateUrl: './buy-same-line-box.component.html',
  styleUrls: ['./buy-same-line-box.component.scss']
})
export class BuySameLineBoxComponent implements OnInit {
  @Input() upcomingDraw: DrawInterface;
  @Input() lottery: LotteryInterface;
  @Input() upcomingDrawLinePrice: number;
  @Input() lines: LineInterface[];

  @Output() redirectToCart = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }
}
