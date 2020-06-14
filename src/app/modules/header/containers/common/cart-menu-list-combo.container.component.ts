import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { OfferingsService } from '../../../../services/offerings/offerings.service';
import { CurrencyService } from '../../../../services/auth/currency.service';
import { Cart2Service } from '../../../../services/cart2/cart2.service';

import { CartComboItemModel } from '../../../../models/cart/cart-combo-item.model';
import { CartItemPrice } from '../../../../services/cart2/entities/cart-item-price-map';
import { of } from 'rxjs/observable/of';
import { OfferingsComboInterface } from '../../../api/entities/incoming/offerings/offerings-combos.interface';

@Component({
  selector: 'app-cart-menu-list-combo-container',
  template: `
    <app-cart-menu-list-item
      [item]="item"
      [url]="null"
      [logo]="(combo$|async)?.logo_path"
      [name]="(combo$|async)?.name"
      [itemPrice]="itemPrice$|async"
      [siteCurrencyId]="siteCurrencyId$|async"

      (deleteItemEvent)="deleteItemEvent.emit($event)"
    ></app-cart-menu-list-item>`
})
export class CartMenuListComboContainerComponent implements AfterViewInit {
  @Input() item: CartComboItemModel;

  @Output() deleteItemEvent = new EventEmitter<CartComboItemModel>();

  combo$: Observable<OfferingsComboInterface>;
  itemPrice$: Observable<CartItemPrice>;
  siteCurrencyId$: Observable<string>;

  constructor(private offeringsService: OfferingsService,
              private cart2Service: Cart2Service,
              private currencyService: CurrencyService) {
  }

  ngAfterViewInit() {
    this.combo$ = this.offeringsService.getActiveCombosMap().pluck(this.item.comboId);
    this.itemPrice$ = this.cart2Service.getItemPriceMap$()
      .pluck(this.item.id)
      .switchMap((x: Observable<any>) => x || of(null));
    this.siteCurrencyId$ = this.currencyService.getCurrencyId();
  }
}
