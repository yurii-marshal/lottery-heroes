import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { OfferFreeLinesInterface } from '../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import { LotteryItemModel } from '../list-of-popular/lottery-item.model';

@Component({
  selector: 'app-list-of-popular-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './list-of-popular-item.component.html',
  styleUrls: ['./list-of-popular-item.component.scss']
})
export class ListOfPopularItemComponent implements OnInit {
  @Input() item: LotteryItemModel;
  @Input() freeLineOffer: OfferFreeLinesInterface;
  @Input() position: number;

  @Output() addToCartEvent = new EventEmitter<any>();

  freeLineOfferClass: string;
  ribbonText: string;
  linesFree: number;
  linesToQualify: number;

  ngOnInit() {
    this.getFreeLineOfferProperties();
  }

  getFreeLineOfferProperties() {
    if (this.freeLineOffer !== null) {
      this.freeLineOfferClass = this.freeLineOffer.display_properties.ribbon_css_class;
      this.ribbonText = this.freeLineOffer.display_properties.short_text;
      this.linesFree = this.freeLineOffer.details.lines_free;
      this.linesToQualify = this.freeLineOffer.details.lines_to_qualify;
    }
  }

  addToCart(event, data) {
    event.preventDefault();
    this.addToCartEvent.emit(data);
  }
}
