import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router } from '@angular/router';

import { AuthService } from '../../../services/auth/auth.service';
import { Cart2Service } from '../../../services/cart2/cart2.service';
import { CartItemModel } from '../../../models/cart/cart-item.model';

@Injectable()
export class IsNotAuthGuard implements CanLoad, CanActivate, CanActivateChild {

  constructor(private router: Router,
              private cart2Service: Cart2Service,
              private authService: AuthService) {}

  canLoad() {
    return this.checkLogin();
  }

  canActivate() {
    return this.checkLogin();
  }

  canActivateChild() {
    return this.checkLogin();
  }

  checkLogin() {
    return this.cart2Service.getItems$()
      .map((itemList: Array<CartItemModel>) => {
        if (!this.authService.checkLogin()) {
          return true;
        } else {
          if (itemList.length > 0) {
            this.router.navigateByUrl('/cart');
          } else {
            this.router.navigateByUrl('/');
          }
          return false;
        }
      });
  }
}
