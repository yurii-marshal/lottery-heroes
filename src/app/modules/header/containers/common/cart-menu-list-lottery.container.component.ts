import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { Cart2Service } from '../../../../services/cart2/cart2.service';

import { CurrencyService } from '../../../../services/auth/currency.service';
import { CartLotteryItemModel } from '../../../../models/cart/cart-lottery-item.model';
import { CartItemPrice } from '../../../../services/cart2/entities/cart-item-price-map';
import { LotteryInterface } from '../../../api/entities/incoming/lotteries/lotteries.interface';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cart-menu-list-lottery-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-cart-menu-list-item
      [item]="item"
      [url]="url$ | async"
      [logo]="(lottery$|async)?.logo"
      [name]="(lottery$|async)?.name"
      [itemPrice]="itemPrice$|async"
      [siteCurrencyId]="siteCurrencyId$|async"

      (deleteItemEvent)="deleteItemEvent.emit($event)"
    ></app-cart-menu-list-item>`
})
export class CartMenuListLotteryContainerComponent implements OnInit {
  @Input() item: CartLotteryItemModel;

  @Output() deleteItemEvent = new EventEmitter<CartLotteryItemModel>();

  lottery$: Observable<LotteryInterface>;
  itemPrice$: Observable<CartItemPrice>;
  siteCurrencyId$: Observable<string>;
  url$: Observable<string>;

  constructor(private lotteriesService: LotteriesService,
              private cart2Service: Cart2Service,
              private currencyService: CurrencyService) {
  }

  ngOnInit() {
    this.lottery$ = this.lotteriesService.getLottery(this.item.lotteryId);
    this.itemPrice$ = this.cart2Service.getItemPriceMap$()
      .pluck(this.item.id)
      .switchMap((x: Observable<any>) => x || of(null));
    this.siteCurrencyId$ = this.currencyService.getCurrencyId();
    this.url$ = this.lotteriesService.getSlug(this.item.lotteryId)
      .pipe(
        map((slug: string) => '/' + slug)
      );
  }
}
