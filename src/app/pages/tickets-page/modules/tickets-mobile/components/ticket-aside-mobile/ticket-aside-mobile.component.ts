import { Component, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';

import { LotteryRulesInterface } from '../../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { LineInterface } from '../../../../../../modules/api/entities/outgoing/common/line.interface';

@Component({
  selector: 'app-ticket-aside-mobile',
  templateUrl: './ticket-aside-mobile.component.html',
  styleUrls: ['./ticket-aside-mobile.component.scss']
})
export class TicketAsideMobileComponent implements OnInit, OnDestroy {
  @Input() line: LineInterface;
  @Input() rules: LotteryRulesInterface;
  @Input() isFilledLine: boolean;

  @Output() asideInitEvent = new EventEmitter<void>();
  @Output() asideDestroyEvent = new EventEmitter<void>();
  @Output() saveUpdatedLineEvent = new EventEmitter<{line: LineInterface, rules: LotteryRulesInterface}>();

  ngOnInit(): void {
    this.asideInitEvent.emit();
  }

  getNumberOfEmptyMainPicks(): number {
    return this.rules.main_numbers.picks - this.line.main_numbers.length;
  }

  getNumberOfEmptyExtraPicks(): number {
    return (this.rules.extra_numbers && !this.rules.extra_numbers.in_results_only) ?
      this.rules.extra_numbers.picks - this.line.extra_numbers.length : 0;
  }

  ngOnDestroy(): void {
    this.asideDestroyEvent.emit();
  }
}
