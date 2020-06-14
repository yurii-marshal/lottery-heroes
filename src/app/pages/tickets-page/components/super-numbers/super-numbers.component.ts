import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ArraysUtil } from '../../../../modules/shared/utils/arrays.util';
import { LotteryRulesInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';

@Component({
  selector: 'app-super-numbers',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './super-numbers.component.html',
  styleUrls: ['./super-numbers.component.scss']
})
export class SuperNumbersComponent {
  @Input() perTicketNumbers: Array<number>;
  @Input() rules: LotteryRulesInterface;

  @Output() togglePerTicketNumbers = new EventEmitter<{rules: LotteryRulesInterface, value: number}>();

  isPicked(value: number): boolean {
    return ArraysUtil.inArray(this.perTicketNumbers, value);
  }
}
