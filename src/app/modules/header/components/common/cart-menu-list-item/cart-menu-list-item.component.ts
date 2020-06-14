import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CartItemModel } from '../../../../../models/cart/cart-item.model';
import { CartItemPrice } from '../../../../../services/cart2/entities/cart-item-price-map';

@Component({
  selector: 'app-cart-menu-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart-menu-list-item.component.html',
  styleUrls: ['./cart-menu-list-item.component.scss'],
})
export class CartMenuListItemComponent {
  @Input() item: CartItemModel;
  @Input() url: string | null;
  @Input() logo: string;
  @Input() name: string;
  @Input() itemPrice: CartItemPrice;
  @Input() siteCurrencyId: string;

  @Output() deleteItemEvent = new EventEmitter<CartItemModel>();
}
