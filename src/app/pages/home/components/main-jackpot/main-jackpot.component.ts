import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { AnalyticsDeprecatedService } from '../../../../modules/analytics-deprecated/services/analytics-deprecated.service';

import { OfferFreeLinesInterface } from '../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import { LotteryItemModel } from './lottery-item.model';

@Component({
  selector: 'app-main-jackpot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main-jackpot.component.html',
  styleUrls: ['./main-jackpot.component.scss']
})
export class MainJackpotComponent implements OnChanges {
  @Input() brandId: string;
  @Input() item: LotteryItemModel;
  @Input() freeLine: OfferFreeLinesInterface;

  @Output() addToCartEvent = new EventEmitter<any>();

  freeLineClass: string;
  linesFree: number;
  linesToQualify: number;

  constructor(private analyticsDeprecatedService: AnalyticsDeprecatedService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.lottery && changes.lottery.currentValue) {
      this.analyticsDeprecatedService.trackListImpressions([this.item.lotteryId], 'homeTop');
    }

    if (changes.freeLine && changes.freeLine.currentValue) {
      this.checkIsLineFree();
    }
  }

  checkIsLineFree() {
    if (this.freeLine !== null) {
      this.freeLineClass = this.freeLine.display_properties.ribbon_css_class;
      this.linesFree = this.freeLine.details.lines_free;
      this.linesToQualify = this.freeLine.details.lines_to_qualify;
    }
  }

  addToCart(data) {
    this.addToCartEvent.emit(data);
  }
}
