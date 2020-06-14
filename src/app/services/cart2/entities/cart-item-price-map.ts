import { Observable } from 'rxjs/Observable';

export interface CartItemPrice {
  price: number;
  discount: number;
  priceWithDiscount: number;
}

export interface CartItemPriceMap {
  [itemId: string]: Observable<CartItemPrice>;
}
