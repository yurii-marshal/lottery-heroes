import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ChangeDetectorRef,
  OnInit,
  NgZone
} from '@angular/core';
import { timer } from 'rxjs/observable/timer';

import { ArraysUtil } from '../../../../../../modules/shared/utils/arrays.util';
import { NumbersUtil } from '../../../../../../modules/shared/utils/numbers.util';
import { ObjectsUtil } from '../../../../../../modules/shared/utils/objects.util';
import { isFilledLine } from '../../../../../../modules/shared/utils/lines/is-filled-line';
import { isCleanLine } from '../../../../../../modules/shared/utils/lines/is-clean-line';

import { LotteryRulesInterface } from '../../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { LineInterface, SelectionTypeIdType } from '../../../../../../modules/api/entities/outgoing/common/line.interface';

@Component({
  selector: 'app-ticket-mobile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ticket-mobile.component.html',
  styleUrls: ['./ticket-mobile.component.scss'],
})
export class TicketMobileComponent implements OnInit {
  @Input()
  set line(line: LineInterface) {
    this.editedLine = ObjectsUtil.deepClone(line);
  }

  @Input() rules: LotteryRulesInterface;

  @Output() numberSelectEvent = new EventEmitter<{line: LineInterface, rules: LotteryRulesInterface}>();
  @Output() mainIsFilled = new EventEmitter<HTMLElement>();
  @Output() autoselectEvent = new EventEmitter<LineInterface>();
  @Output() clearEvent = new EventEmitter<{lotteryId: string}>();

  @Output() asideInitEvent = new EventEmitter<void>();
  @Output() asideDestroyEvent = new EventEmitter<void>();
  @Output() saveUpdatedLineEvent = new EventEmitter<{line: LineInterface, rules: LotteryRulesInterface}>();

  editedLine: LineInterface;

  private isAnimationRun = false;
  isFilledLine: boolean;

  constructor(protected elementRef: ElementRef,
              protected changeDetectorRef: ChangeDetectorRef,
              private zone: NgZone) {
  }

  ngOnInit(): void {
    this.isFilledLine = this.isPickedAll();
  }

  onAutoselectClickEvent(): void {
    const serializedLine = JSON.stringify(this.editedLine);

    this.zone.runOutsideAngular(() => {
      timer(0, 100).take(6)
        .subscribe(() => {
          this.zone.run(() => {
            this.editedLine = this.autoselect(JSON.parse(serializedLine), this.rules);
            this.sortTicketNumbers();
            this.changeDetectorRef.detectChanges();
          });
        }, null, () => {
          this.zone.run(() => {
            this.autoselectEvent.emit(ObjectsUtil.deepClone(this.editedLine));
            this.isFilledLine = this.isPickedAll();
          });
        });
    });
  }

  onClearClickEvent(): void {
    this.editedLine = this.clear(this.editedLine);
    this.clearEvent.emit({lotteryId: this.editedLine.lottery_id});
    this.isFilledLine = this.isPickedAll();
  }

  isPickedMain(value: number): boolean {
    return this.isAnimationRun === false && ArraysUtil.inArray(this.editedLine.main_numbers, value);
  }

  isPickedExtra(value: number): boolean {
    return this.isAnimationRun === false && ArraysUtil.inArray(this.editedLine.extra_numbers, value);
  }

  isPickedAll(): boolean {
    return isFilledLine(this.editedLine, this.rules);
  }

  toggleMain(value: number): void {
    if (this.isPickedMain(value)) {
      this.removeMain(value);
    } else {
      this.pickMain(value);
    }

    this.numberSelectEvent.emit({line: ObjectsUtil.deepClone(this.editedLine), rules: this.rules});

    if (this.editedLine.main_numbers.length === this.rules.main_numbers.picks) {
      if (!this.rules.extra_numbers || this.editedLine.extra_numbers.length < this.rules.extra_numbers.picks) {
        this.mainIsFilled.emit(this.elementRef.nativeElement.querySelector('.pick-extra-text'));
      }
    }
    this.isFilledLine = this.isPickedAll();
  }

  toggleExtra(value: number): void {
    if (this.isPickedExtra(value)) {
      this.removeExtra(value);
    } else {
      if (this.rules.extra_numbers.picks === 1) {
        this.editedLine.extra_numbers = [];
      }
      this.pickExtra(value);
    }

    this.numberSelectEvent.emit({line: ObjectsUtil.deepClone(this.editedLine), rules: this.rules});
    this.isFilledLine = this.isPickedAll();
  }

  private removeMain(value: number): void {
    ArraysUtil.removeValue(value, this.editedLine.main_numbers);
  }

  private removeExtra(value: number): void {
    ArraysUtil.removeValue(value, this.editedLine.extra_numbers);
  }

  private pickMain(num: number): void {
    if (this.editedLine.main_numbers.length < this.rules.main_numbers.picks) {
      this.editedLine.selection_type_id = this.getSelectionTypeIdOnManual(this.editedLine);
      this.editedLine.main_numbers.push(num);
    }
    this.sortTicketNumbers();
  }

  private pickExtra(num: number): void {
    if (this.editedLine.extra_numbers.length < this.rules.extra_numbers.picks) {
      this.editedLine.selection_type_id = this.getSelectionTypeIdOnManual(this.editedLine);
      this.editedLine.extra_numbers.push(num);
    }
    this.sortTicketNumbers();
  }

  private clear(line: LineInterface): LineInterface {
    line.main_numbers = [];
    line.extra_numbers = [];

    return line;
  }

  private autoselect(line: LineInterface, rules: LotteryRulesInterface): LineInterface {
    let clearBeforePick = false;

    if (isFilledLine(line, rules)) {
      line.main_numbers = [];
      line.extra_numbers = [];
      clearBeforePick = true;
    }

    line.selection_type_id = this.getSelectionTypeIdOnAuto(line, clearBeforePick);

    line.main_numbers = NumbersUtil.getRandomUniqueNumbersArray(
      line.main_numbers,
      rules.main_numbers.picks,
      rules.main_numbers.lowest,
      rules.main_numbers.highest
    );

    if (rules.extra_numbers && !rules.extra_numbers.in_results_only) {
      line.extra_numbers = NumbersUtil.getRandomUniqueNumbersArray(
        line.extra_numbers,
        rules.extra_numbers.picks,
        rules.extra_numbers.lowest,
        rules.extra_numbers.highest
      );
    }
    return line;
  }

  private getSelectionTypeIdOnManual(line: LineInterface): SelectionTypeIdType {
    if (isCleanLine(line)) {
      return 'manual';
    } else {
      switch (line.selection_type_id) {
        case 'automatic':
          return 'mixed';
        case 'mixed':
          return 'mixed';
        default:
          return 'manual';
      }
    }
  }

  private getSelectionTypeIdOnAuto(line: LineInterface, clearBeforePick: boolean): SelectionTypeIdType {
    if (clearBeforePick) {
      return 'automatic';
    } else {
      switch (line.selection_type_id) {
        case 'manual':
          if (isCleanLine(line)) {
            return 'automatic';
          } else {
            return 'mixed';
          }
        case 'mixed':
          return 'mixed';
        default:
          return 'automatic';
      }
    }
  }

  private sortTicketNumbers(): void {
    this.editedLine.main_numbers.sort(NumbersUtil.sortNumbersAscFunction);
    this.editedLine.extra_numbers.sort(NumbersUtil.sortNumbersAscFunction);
  }
}
