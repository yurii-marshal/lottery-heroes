import { Injectable } from '@angular/core';
import { Cart2Service } from './cart2.service';
import { CartSyndicateItemModel } from '../../models/cart/cart-syndicate-item.model';
import { OfferingsService } from '../offerings/offerings.service';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { CartItemModel } from '../../models/cart/cart-item.model';
import { first, map } from 'rxjs/operators';
import { ObjectsUtil } from '../../modules/shared/utils/objects.util';
import { Observable } from 'rxjs/Observable';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';

@Injectable()
export class Cart2SyndicateService {
  constructor(private cart2Service: Cart2Service,
              private offeringsService: OfferingsService,
              private syndicateQueryService: SyndicatesQueryService) {}

  addItems(items: CartSyndicateItemModel[]): void {
    combineLatest(
      this.syndicateQueryService.getSyndicateModelsMap(),
      this.cart2Service.getItems$()
    )
      .pipe(
        first()
      )
      .subscribe(data => {
        const syndicatesMap: { [p: string]: SyndicateModel } = data[0];
        const cartItems: CartItemModel[] = ObjectsUtil.deepClone(data[1]);

        items.forEach((item: CartSyndicateItemModel) => {
          if (!this.validateItem(item, syndicatesMap)) {
            return;
          }

          const syndicateTemplate = syndicatesMap[item.lotteryId];

          const syndicateCartItem = cartItems.find((cartItem: CartItemModel) => {
            return cartItem.type === 'syndicate' && (<CartSyndicateItemModel>cartItem).templateId === item.templateId;
          }) as CartSyndicateItemModel;

          if ((typeof syndicateCartItem === 'undefined' || syndicateCartItem === null) &&
            item.numShares <= syndicateTemplate.numSharesAvailable) {
            cartItems.push(item);
          } else if ((syndicateCartItem.numShares + item.numShares) <= syndicateTemplate.numSharesAvailable) {
            syndicateCartItem.numShares += item.numShares;
          }
        });

        this.cart2Service.setItems(cartItems);
      });
  }

  removeShares(templateId: number, shareNumberToRemove: number): void {
    if (shareNumberToRemove <= 0) {
      return;
    }

    this.cart2Service.getItems$()
      .pipe(
        first()
      )
      .subscribe((cartItems: CartItemModel[]) => {
        cartItems = ObjectsUtil.deepClone(cartItems);
        const cartSyndicateItem = cartItems.find((item: CartItemModel) => {
          return item.type === 'syndicate' && (<CartSyndicateItemModel>item).templateId === templateId;
        }) as CartSyndicateItemModel;

        if (typeof cartSyndicateItem === 'undefined' || cartSyndicateItem.numShares <= 1) {
          return;
        }

        const numShares = cartSyndicateItem.numShares - shareNumberToRemove;

        if (numShares >= 1) {
          cartSyndicateItem.numShares = numShares;
          this.cart2Service.setItems(cartItems);
        }
      });
  }

  checkAndUpdateItems(cartItems: Array<CartItemModel>): Observable<CartItemModel[]> {
    return this.syndicateQueryService.getSyndicateModelsMap()
      .pipe(
        map((syndicatesMap: { [p: string]: SyndicateModel }) => {
          return cartItems.filter((item: CartSyndicateItemModel) => this.validateItem(item, syndicatesMap));
        })
      );
  }

  setShares(templateId: number, numShares: number): void {
    this.cart2Service.getItems$()
      .pipe(
        first()
      )
      .subscribe((cartItems: CartItemModel[]) => {
        const clonedCartItems = ObjectsUtil.deepClone(cartItems);

        const syndicateIndex = clonedCartItems.findIndex((cartItem: CartItemModel) => {
          return cartItem.type === 'syndicate' && (<CartSyndicateItemModel>cartItem).templateId === templateId;
        });

        if (typeof syndicateIndex === 'undefined' || syndicateIndex < 0) {
          return;
        }

        (<CartSyndicateItemModel>clonedCartItems[syndicateIndex]).numShares = numShares;

        this.cart2Service.setItems(clonedCartItems);
      });
  }

  convertSyndicatesToItems(syndicates: Array<any>): Array<CartSyndicateItemModel> {
    const items: Array<CartSyndicateItemModel> = [];

    syndicates.forEach((syndicate: any) => {
      items.push(new CartSyndicateItemModel(syndicate.templateId, syndicate.numShares, syndicate.lotteryId));
    });

    return items;
  }

  getSyndicates(): Observable<CartSyndicateItemModel[]> {
    return this.cart2Service.getItems$()
      .map((items: Array<CartItemModel>) => items.filter((item: CartItemModel) => item.type === 'syndicate'))
      .map((items: Array<CartSyndicateItemModel>) => items.map((item: CartSyndicateItemModel) => item));
  }

  private validateItem(item: CartSyndicateItemModel, syndicatesMap: { [p: string]: SyndicateModel }): boolean {
    if (item.type !== 'syndicate') {
      return true;
    }

    if (typeof syndicatesMap[item.lotteryId] === 'undefined' || syndicatesMap[item.lotteryId] === null) {
      return false;
    }

    return true;
  }
}
