import { Injectable } from '@angular/core';

import { Cart2Service } from './cart2.service';
import { OfferingsService } from '../offerings/offerings.service';
import { LinesService } from '../lines.service';
import { CartItemModel } from '../../models/cart/cart-item.model';
import { Observable } from 'rxjs/Observable';
import { LineInterface, SelectionTypeIdType } from '../../modules/api/entities/outgoing/common/line.interface';
import { ObjectsUtil } from '../../modules/shared/utils/objects.util';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';
import { first } from 'rxjs/operators';
import {OfferingsBundleInterface} from '../../modules/api/entities/incoming/offerings/offerings-bundles.interface';
import {BundleItemModel} from '../../models/bundle.model';
import {CartBundleItemModel} from '../../models/cart/cart-bundle-item.model';
import {BundleInterface} from '../../modules/api/entities/outgoing/common/bundle.interface';
import {OfferingsBundlesMapInterface} from '../offerings/entities/offerings-bundles-map.interface';

@Injectable()
export class Cart2BundleService {
  private syndicatesMap: { [lotteryId: string]: SyndicateModel };

  constructor(private cart2Service: Cart2Service,
              private offeringsService: OfferingsService,
              private linesService: LinesService,
              private syndicatesQueryService: SyndicatesQueryService) {
    this.syndicatesQueryService.getSyndicateModelsMap()
      .pipe(
        first()
      )
      .subscribe((syndicatesMap: { [lotteryId: string]: SyndicateModel }) => this.syndicatesMap = syndicatesMap);
  }

  addItems(addedItems: Array<CartBundleItemModel>): void {
    this.offeringsService.getActiveBundlesMap()
      .first()
      .subscribe((bundlesMap: OfferingsBundlesMapInterface) => {
        addedItems.forEach((addedItem: CartBundleItemModel) => {
          console.log(addedItem);
          if (this.validateItem(addedItem, bundlesMap)) {
            this.cart2Service.addItems([addedItem]);
          }
        });
      });
  }

  generateLines(bundle: OfferingsBundleInterface | BundleItemModel): Array<LineInterface> {
    let lines = [];

    bundle.items.forEach((bundleItem: { lottery_id: string, type: string, syndicate_template_id: number, items_qty: number }) => {
      if (bundleItem.type === 'lines') {
        lines = [...lines, ...this.linesService.generateAutoselectedLines(bundleItem.lottery_id, bundleItem.items_qty)];
      }
    });

    return lines;
  }

  updateLine(itemId: string, line: LineInterface): void {
    this.cart2Service.getItems$()
      .first()
      .subscribe((items: Array<CartItemModel>) => {
        const updatedItems: Array<CartItemModel> = ObjectsUtil.deepClone(items);
        const updatedItem: CartBundleItemModel = updatedItems
          .find((item: CartItemModel) => item.id === itemId) as CartBundleItemModel;
        updatedItem.updateLine(line);
        this.cart2Service.setItems(updatedItems);
      });
  }

  changeRenewPeriod(itemId: string, renewPeriod: string | null): void {
    // NO SUBSCRIPTIONS FOR COMBOS
    renewPeriod = null;

    this.cart2Service.getItems$()
      .first()
      .subscribe((items: Array<CartItemModel>) => {
        const updatedItems: Array<CartItemModel> = ObjectsUtil.deepClone(items);
        const updatedItem: CartBundleItemModel = updatedItems
          .find((item: CartBundleItemModel) => item.id === itemId) as CartBundleItemModel;

        if (typeof updatedItem !== 'undefined') {
          updatedItem.renewPeriod = renewPeriod;
          this.cart2Service.setItems(updatedItems);
        } else {
          throw new Error('Cant change renew period - no bundle item in cart');
        }
      });
  }

  convertBundlesToItems(bundles: Array<BundleInterface>): Array<CartBundleItemModel> {
    const items: Array<CartBundleItemModel> = [];

    bundles.forEach((bundle: BundleInterface) => {
      items.push(new CartBundleItemModel(bundle.id, bundle.lines));
    });

    return items;
  }

  checkAndUpdateItems(cartItems: Array<CartItemModel>): Observable<CartItemModel[]> {
    return this.offeringsService.getActiveBundlesMap()
      .first()
      .map((bundlesMap: OfferingsBundlesMapInterface) => {
        let items = ObjectsUtil.deepClone(cartItems);

        // filter nonexistent bundles
        items = items.filter((item: CartBundleItemModel) => this.validateItem(item, bundlesMap));

        // clean draws
        items = items.map((item: CartBundleItemModel) => {
          if (item.type !== 'bundle') {
            return item;
          }
          item.lines = item.lines.map(line => {
            line.draws = 1;
            return line;
          });
          return item;
        });

        return items;
      });
  }

  generateShares(bundle: OfferingsBundleInterface | BundleItemModel): Array<{ template_id: number, num_shares: number}> {
    const shares = [];

    bundle.items.forEach((item: { lottery_id: string, type: string, syndicate_template_id: number, items_qty: number }) => {
      if (item.type === 'shares') {
        shares.push({
          template_id: item.syndicate_template_id,
          num_shares: item.items_qty
        });
      }
    });

    return shares;
  }

  private validateItem(item: CartBundleItemModel, bundlesMap: OfferingsBundlesMapInterface): boolean {
    if (item.type !== 'bundle') {
      return true;
    }

    if (!bundlesMap[item.bundleId]) {
      return false;
    }

    return true;
  }
}
