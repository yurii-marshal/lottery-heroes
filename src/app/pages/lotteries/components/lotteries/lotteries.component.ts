import {
  ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnChanges, OnDestroy, PLATFORM_ID, SimpleChanges,
  ViewChild
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { LotteriesSortByType } from '../../types/lotteries-sort-by.type';

@Component({
  selector: 'app-lotteries',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lotteries.component.html',
  styleUrls: ['./lotteries.component.scss'],
})

export class LotteriesComponent implements OnChanges, OnDestroy {
  @Input() sortBy: LotteriesSortByType;
  @Input() sortedLotteryIds: string[];

  @ViewChild('shuffleContainer')
  shuffleContainer: ElementRef;

  initialLotteriesOrder: Array<string>;
  shuffleInstance: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.sortedLotteryIds && changes.sortedLotteryIds.currentValue !== null && typeof this.initialLotteriesOrder === 'undefined') {
      this.initialLotteriesOrder = changes.sortedLotteryIds.currentValue;
    }

    if (changes.sortBy && changes.sortBy.firstChange === false) {
      this.sortShuffle(changes.sortedLotteryIds.currentValue);
    }
  }

  private initShuffle(): void {
    this.shuffleInstance = new Shuffle(this.shuffleContainer.nativeElement, {
      gutterWidth: 10,
    });
  }

  private sortShuffle(sortedLotteryIds: Array<string>): void {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.shuffleInstance) {
        this.initShuffle();
      }

      this.shuffleInstance.sort({
        by: (element) => {
          return sortedLotteryIds.indexOf(element.getAttribute('data-lottery-id'));
        },
      });
    } else {
      this.initialLotteriesOrder = sortedLotteryIds;
    }
  }

  ngOnDestroy(): void {
    if (this.shuffleInstance) {
      this.shuffleInstance.destroy();
    }
  }
}
