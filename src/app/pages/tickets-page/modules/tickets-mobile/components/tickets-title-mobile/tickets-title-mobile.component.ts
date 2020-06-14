import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { LotteryRulesInterface } from '../../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';

@Component({
  selector: 'app-tickets-title-mobile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tickets-title-mobile.component.html',
  styleUrls: ['./tickets-title-mobile.component.scss']
})
export class TicketsTitleMobileComponent {
  @Input() rules: LotteryRulesInterface;
}
