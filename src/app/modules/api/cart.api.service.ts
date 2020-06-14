import { Injectable } from '@angular/core';
import { BaseApiService } from './base.api.service';
import { Observable } from 'rxjs/Observable';
import { CartItemsInterface } from './entities/cart-items.interface';

@Injectable()
export class CartApiService {
  constructor(private baseApiService: BaseApiService) { }

  getCustomerCart(): Observable<CartItemsInterface> {
    return this.baseApiService.get('/customers/cart/');
  }

  updateCustomerCart(cartItems: CartItemsInterface) {
    return this.baseApiService.put('/customers/cart/', JSON.stringify(cartItems));
  }
}
