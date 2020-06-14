import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';

@Component({
  selector: 'app-syndicate-total-mobile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './syndicate-total-mobile.component.html',
  styleUrls: ['./syndicate-total-mobile.component.scss']
})
export class SyndicateTotalMobileComponent implements OnChanges {
  @Input() syndicateModel: SyndicateModel;
  @Input() sharesAmount: number;

  @Output() addToCartEvent = new EventEmitter<{templateId: number, lotteryId: string; sharesAmount: number}>();

  totalSyndicatePrice: number;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sharesAmount']) {
      this.totalSyndicatePrice = this.sharesAmount ? this.syndicateModel.sharePrice * this.sharesAmount : 0;
    }
  }
}
