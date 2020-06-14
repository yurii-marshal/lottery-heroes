import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Cart2Service } from '../../../services/cart2/cart2.service';
import { Cart2LotteryService } from '../../../services/cart2/cart2-lottery.service';
import { CartLotteryItemModel } from '../../../models/cart/cart-lottery-item.model';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Injectable()
export class CashierGuard implements CanLoad, CanActivate, CanActivateChild {
  constructor(private router: Router,
              private cart2Service: Cart2Service,
              private cart2LotteryService: Cart2LotteryService) {
  }

  canLoad(): Observable<boolean> {
    return this.check();
  }

  canActivate(): Observable<boolean> {
    return this.check();
  }

  canActivateChild(): Observable<boolean> {
    return this.check();
  }

  private check(): Observable<boolean> {
    return combineLatest(
      this.cart2Service.getNumberOfItems$(),
      this.cart2LotteryService.getLessThanMinLotteryItems$(),
    )
      .first()
      .map(([numberOfItems, lessThanMinLotteryItems]: [number, Array<CartLotteryItemModel>]) => {
        if (numberOfItems === 0) {
          this.router.navigateByUrl('/cart', {replaceUrl: true});
          return false;
        }

        if (lessThanMinLotteryItems.length > 0) {
          this.router.navigateByUrl('/cart');
          return false;
        }

        return true;
      });
  }
}
