import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ArraysUtil } from '../../../../../../modules/shared/utils/arrays.util';
import { LotteryRulesInterface } from '../../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';

@Component({
  selector: 'app-super-numbers-pick-mobile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './super-numbers-pick-mobile.component.html',
  styleUrls: ['./super-numbers-pick-mobile.component.scss']
})
export class SuperNumbersPickMobileComponent {
  @Input()
  set perTicketNumbers(numbers: Array<number>) {
    this.editedPerTicketNumbers = [...numbers];
  }
  @Input() rules: LotteryRulesInterface;

  @Output() closePickedPerTicketNumbersEvent = new EventEmitter();
  @Output() savePerTicketNumbersEvent = new EventEmitter<{rules: LotteryRulesInterface, value: Array<number>}>();

  editedPerTicketNumbers: Array<number>;

  getNumberOfEmptyPicks(): number {
    return this.rules.perticket_numbers.picks - this.editedPerTicketNumbers.length;
  }

  toggle(value: number): void {
    if (this.isPicked(value)) {
      this.remove(value);
    } else {
      if (this.rules.perticket_numbers.picks === 1) {
        this.editedPerTicketNumbers = [];
      }
      this.pick(value);
    }
  }

  isPicked(value: number): boolean {
    return ArraysUtil.inArray(this.editedPerTicketNumbers, value);
  }

  private pick(num: number): void {
    if (this.editedPerTicketNumbers.length < this.rules.perticket_numbers.picks) {
      this.editedPerTicketNumbers.push(num);
    }
  }

  private remove(value: number): void {
    ArraysUtil.removeValue(value, this.editedPerTicketNumbers);
  }
}
