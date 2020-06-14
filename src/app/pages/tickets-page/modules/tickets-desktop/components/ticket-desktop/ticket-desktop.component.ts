import {
  Component, ChangeDetectionStrategy, Input, Output, OnChanges, AfterViewInit, OnDestroy,
  EventEmitter, Renderer2, ElementRef, SimpleChanges, ChangeDetectorRef, NgZone, OnInit
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { timer } from 'rxjs/observable/timer';

import { ArraysUtil } from '../../../../../../modules/shared/utils/arrays.util';
import { NumbersUtil } from '../../../../../../modules/shared/utils/numbers.util';
import { isFilledLine } from '../../../../../../modules/shared/utils/lines/is-filled-line';
import { LotteryRulesInterface } from '../../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { LineInterface } from '../../../../../../modules/api/entities/outgoing/common/line.interface';

@Component({
  selector: 'app-ticket-desktop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ticket-desktop.component.html',
  styleUrls: ['./ticket-desktop.component.scss'],
})
export class TicketDesktopComponent implements OnChanges, AfterViewInit, OnDestroy, OnInit {
  @Input() lineIndex: number;
  @Input() line: LineInterface;
  @Input() rules: LotteryRulesInterface;
  @Input() autoselectAnimateCommand$: Observable<LineInterface>;
  @Input() autoselectAnimateIterations: number;
  @Input() autoselectIterationTime: number;
  @Input() isLoggedIn: boolean;

  @Output() autoselectLineEvent = new EventEmitter<{line: LineInterface, rules: LotteryRulesInterface, track: boolean}>();
  @Output() clearLineEvent = new EventEmitter<{line: LineInterface}>();
  @Output() toggleMainEvent = new EventEmitter<{line: LineInterface, rules: LotteryRulesInterface, value: number}>();
  @Output() toggleExtraEvent = new EventEmitter<{line: LineInterface, rules: LotteryRulesInterface, value: number}>();
  @Output() changeStatusLuckyNumbersEvent = new EventEmitter<{lotteryId: string, lineId: string, isChecked: boolean}>();

  isFilledLine = false;
  _luckyNumbersStatus: boolean;

  protected isAnimationRun = false;
  protected aliveSubscriptions = true;

  constructor(protected renderer: Renderer2,
              protected elementRef: ElementRef,
              protected changeDetectorRef: ChangeDetectorRef,
              private zone: NgZone) {
  }

  ngOnInit(): void {
    this.isFilledLine = isFilledLine(this.line, this.rules);
  }

  ngAfterViewInit(): void {
    if (this.autoselectAnimateCommand$) {
      this.autoselectAnimateCommand$
        .takeWhile(() => this.aliveSubscriptions)
        .subscribe((line: LineInterface) => this.animateAutoselect(line));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['line'] && changes['line'].firstChange !== true) {
      this.isFilledLine = isFilledLine(this.line, this.rules);
    }
  }

  isPickedMain(value: number): boolean {
    return this.isAnimationRun === false && ArraysUtil.inArray(this.line.main_numbers, value);
  }

  isPickedExtra(value: number): boolean {
    return this.isAnimationRun === false && ArraysUtil.inArray(this.line.extra_numbers, value);
  }

  protected animateAutoselect(lineBefore: LineInterface): void {
    this.fakeAutoselectForSelected(lineBefore);
    this.isAnimationRun = true;

    this.zone.runOutsideAngular(() => {
      timer(0, this.autoselectIterationTime).take(this.autoselectAnimateIterations)
        .subscribe((iteration: number) => {
          this.zone.run(() => {
            if (iteration < this.autoselectAnimateIterations - 1) {
              this.removeFakeAutoselect();
              this.fakeAutoselect(lineBefore);
            } else {
              this.removeFakeAutoselect();
              this.isAnimationRun = false;
              this.changeDetectorRef.markForCheck();
            }
          });
        });
    });
  }

  private fakeAutoselectForSelected(lineBefore: LineInterface): void {
    this.elementRef.nativeElement.querySelectorAll('.number.main')
      .forEach((element: ElementRef, index: number) => {
        if (ArraysUtil.inArray(lineBefore.main_numbers, index + 1)) {
          this.renderer.addClass(element, 'fake-picked');
        }
      });

    if (this.rules.extra_numbers && !this.rules.extra_numbers.in_results_only) {
      this.elementRef.nativeElement.querySelectorAll('.number.extra')
        .forEach((element: ElementRef, index: number) => {
          if (ArraysUtil.inArray(lineBefore.extra_numbers, index + 1)) {
            this.renderer.addClass(element, 'fake-picked');
          }
        });
    }
  }

  private fakeAutoselect(lineBefore: LineInterface): void {
    const mainNumbers = NumbersUtil.getRandomUniqueNumbersArray(
      isFilledLine(lineBefore, this.rules) ? [] : [...lineBefore.main_numbers],
      this.rules.main_numbers.picks,
      this.rules.main_numbers.lowest,
      this.rules.main_numbers.highest
    );

    let extraNumbers;
    if (this.rules.extra_numbers && !this.rules.extra_numbers.in_results_only) {
      extraNumbers = NumbersUtil.getRandomUniqueNumbersArray(
        isFilledLine(lineBefore, this.rules) ? [] : [...lineBefore.extra_numbers],
        this.rules.extra_numbers.picks,
        this.rules.extra_numbers.lowest,
        this.rules.extra_numbers.highest
      );
    }

    this.elementRef.nativeElement.querySelectorAll('.number.main')
      .forEach((element: ElementRef, index: number) => {
        if (ArraysUtil.inArray(mainNumbers, index + 1)) {
          this.renderer.addClass(element, 'fake-picked');
        }
      });

    if (this.rules.extra_numbers && !this.rules.extra_numbers.in_results_only) {
      this.elementRef.nativeElement.querySelectorAll('.number.extra')
        .forEach((element: ElementRef, index: number) => {
          if (ArraysUtil.inArray(extraNumbers, index + 1)) {
            this.renderer.addClass(element, 'fake-picked');
          }
        });
    }
  }

  private removeFakeAutoselect(): void {
    this.elementRef.nativeElement.querySelectorAll('.fake-picked')
      .forEach((element: ElementRef) => {
        this.renderer.removeClass(element, 'fake-picked');
      });
  }


  // move it to container
  onLuckyClicked(): void {
    if (this.line.selection_type_id === 'lucky_numbers') {
      this.clearLineEvent.emit({line: this.line});
      this._luckyNumbersStatus = false;
    } else {
      if (this.line.main_numbers.length) {
        this._luckyNumbersStatus = !this._luckyNumbersStatus;
        this.changeStatusLuckyNumbersEvent.emit({
          lotteryId: this.line.lottery_id,
          lineId: this.line.id,
          isChecked: this._luckyNumbersStatus
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.aliveSubscriptions = false;
  }
}
