import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AddToCartOffersModel } from '../../models/add-to-cart-offers.model';

@Component({
  selector: 'app-add-to-cart-offers-item',
  templateUrl: './add-to-cart-offers-item.component.html',
  styleUrls: ['./add-to-cart-offers-item.component.scss']
})
export class AddToCartOffersItemComponent implements OnInit {
  @Input() addToCartOffersModel: AddToCartOffersModel;

  @Output() addToCartEvent = new EventEmitter<string>();
  @Output() addToCartFromRibbonEvent = new EventEmitter<any>();
  @Output() addToCartSyndicateEvent = new EventEmitter<{ templateId: number, lotteryId: string }>();

  freeLineOfferClass: string;
  ribbonText: string;
  linesFree: number;
  linesToQualify: number;

  ngOnInit() {
    this.getFreeLineOfferProperties();
  }

  getFreeLineOfferProperties() {
    if (this.addToCartOffersModel.freeLineOffer) {
      this.freeLineOfferClass = this.addToCartOffersModel.freeLineOffer.display_properties.ribbon_css_class;
      this.ribbonText = this.addToCartOffersModel.freeLineOffer.display_properties.short_text;
      this.linesFree = this.addToCartOffersModel.freeLineOffer.details.lines_free;
      this.linesToQualify = this.addToCartOffersModel.freeLineOffer.details.lines_to_qualify;
    }
  }

  addToCartFromRibbon(event, data) {
    event.preventDefault();
    this.addToCartFromRibbonEvent.emit(data);
  }

  addToCart(model: AddToCartOffersModel) {
    if (model.isSyndicate) {
      this.addToCartSyndicateEvent.emit({ templateId: model.syndicateTemplateId, lotteryId: model.lotteryId });
    } else {
      this.addToCartEvent.emit(model.lotteryId);
    }
  }
}
