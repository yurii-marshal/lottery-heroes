import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { Cart2Service } from '../../../../services/cart2/cart2.service';

import { CurrencyService } from '../../../../services/auth/currency.service';
import { CartItemPrice } from '../../../../services/cart2/entities/cart-item-price-map';
import { LotteryInterface } from '../../../api/entities/incoming/lotteries/lotteries.interface';
import { CartSyndicateItemModel } from '../../../../models/cart/cart-syndicate-item.model';
import { filter, map, pluck, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-cart-menu-list-syndicate-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-cart-menu-list-item
      [item]="item"
      [url]="url$ | async"
      [logo]="(lottery$ | async)?.logo"
      [name]="(lottery$ | async)?.name"
      [itemPrice]="itemPrice$ | async"
      [siteCurrencyId]="siteCurrencyId$ | async"
      (deleteItemEvent)="deleteItemEvent.emit($event)"
    ></app-cart-menu-list-item>`
})
export class CartMenuListSyndicateContainerComponent implements OnInit {
  @Input() item: CartSyndicateItemModel;

  @Output() deleteItemEvent = new EventEmitter<CartSyndicateItemModel>();

  lottery$: Observable<LotteryInterface>;
  itemPrice$: Observable<CartItemPrice>;
  siteCurrencyId$: Observable<string>;
  url$: Observable<string>;

  constructor(private lotteriesService: LotteriesService,
              private cart2Service: Cart2Service,
              private currencyService: CurrencyService) {
  }

  ngOnInit() {
    this.lottery$ = this.lotteriesService.getLottery(this.item.lotteryId)
      .pipe(
        filter((lottery: LotteryInterface) => typeof lottery !== 'undefined')
      )
      .publishReplay(1).refCount();

    this.siteCurrencyId$ = this.currencyService.getCurrencyId().publishReplay(1).refCount();

    this.itemPrice$ = this.cart2Service.getItemPriceMap$()
      .pipe(
        pluck(this.item.id),
        switchMap((x: Observable<any>) => x || of(null))
      );

    this.url$ = this.lotteriesService.getSlug(this.item.lotteryId)
      .pipe(
        map((slug: string) => '/' + slug)
      );
  }
}
