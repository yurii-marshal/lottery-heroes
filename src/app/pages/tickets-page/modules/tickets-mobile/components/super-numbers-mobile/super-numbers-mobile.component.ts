import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LotteryRulesInterface } from '../../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';

@Component({
  selector: 'app-super-numbers-mobile',
  templateUrl: './super-numbers-mobile.component.html',
  styleUrls: ['./super-numbers-mobile.component.scss']
})
export class SuperNumbersMobileComponent {
  @Input() rules: LotteryRulesInterface;
  @Input() perTicketNumbers: Array<string>;

  @Output() clickPerTicketNumbersEvent = new EventEmitter();
}
