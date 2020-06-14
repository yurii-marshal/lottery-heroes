import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output,
  SimpleChanges
} from '@angular/core';

import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';

@Component({
  selector: 'app-syndicate-body-mobile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './syndicate-body-mobile.component.html',
  styleUrls: ['./syndicate-body-mobile.component.scss']
})
export class SyndicateBodyMobileComponent implements OnChanges {
  @Input() syndicateModel: SyndicateModel;
  @Input() sharesAmount: number;

  @Output() addShareEvent = new EventEmitter<{lotteryId: string, sharesAmount: number, sharesBeforeClick: number}>();
  @Output() removeShareEvent = new EventEmitter<{lotteryId: string, sharesAmount: number, sharesBeforeClick: number}>();
  @Output() viewLinesEvent = new EventEmitter<{
    lotteryName: string, lines: Array<{
      mainNumbers: number[],
      extraNumbers: number[],
      perticketNumbers: number[],
    }>
  }>();

  progressbarWidth: string;
  sharesStep = 1;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sharesAmount']) {
      this.progressbarWidth = (100 / this.syndicateModel.numShares) *
        (this.syndicateModel.numShares - (this.syndicateModel.numSharesAvailable - this.sharesAmount)) + '%';
    }
  }
}
