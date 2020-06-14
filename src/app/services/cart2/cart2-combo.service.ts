import { Injectable } from '@angular/core';

import { Cart2Service } from './cart2.service';
import { OfferingsService } from '../offerings/offerings.service';
import { CartComboItemModel } from '../../models/cart/cart-combo-item.model';
import { OfferingsCombosMapInterface } from '../offerings/entities/offerings-combos-map.interface';
import { LinesService } from '../lines.service';
import { CartItemModel } from '../../models/cart/cart-item.model';
import { Observable } from 'rxjs/Observable';
import { ComboItemModel } from '../../models/combo.model';
import { ComboInterface } from '../../modules/api/entities/outgoing/common/combo.interface';
import { LineInterface, SelectionTypeIdType } from '../../modules/api/entities/outgoing/common/line.interface';
import { ObjectsUtil } from '../../modules/shared/utils/objects.util';
import { OfferingsComboInterface } from '../../modules/api/entities/incoming/offerings/offerings-combos.interface';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';
import { first } from 'rxjs/operators';
import { IdUtil } from '../../modules/shared/utils/id.util';

@Injectable()
export class Cart2ComboService {
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

  addItems(addedItems: Array<CartComboItemModel>): void {
    this.offeringsService.getActiveCombosMap()
      .first()
      .subscribe((combosMap: OfferingsCombosMapInterface) => {
        addedItems.forEach((addedItem: CartComboItemModel) => {
          if (this.validateItem(addedItem, combosMap)) {
            this.cart2Service.addItems([addedItem]);
          }
        });
      });
  }

  generateLines(combo: OfferingsComboInterface | ComboItemModel): Array<LineInterface> {
    let lines = [];

    combo.items.forEach((comboItem: { lottery_id: string, type: string, syndicate_template_id: number, items_qty: number }) => {
      if (comboItem.type === 'lines') {
        lines = [...lines, ...this.linesService.generateAutoselectedLines(comboItem.lottery_id, comboItem.items_qty)];
      }
    });

    return lines;
  }

  updateLine(itemId: string, line: LineInterface): void {
    this.cart2Service.getItems$()
      .first()
      .subscribe((items: Array<CartItemModel>) => {
        const updatedItems: Array<CartItemModel> = ObjectsUtil.deepClone(items);
        const updatedItem: CartComboItemModel = updatedItems
          .find((item: CartItemModel) => item.id === itemId) as CartComboItemModel;
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
        const updatedItem: CartComboItemModel = updatedItems
          .find((item: CartComboItemModel) => item.id === itemId) as CartComboItemModel;

        if (typeof updatedItem !== 'undefined') {
          updatedItem.renewPeriod = renewPeriod;
          this.cart2Service.setItems(updatedItems);
        } else {
          throw new Error('Cant change renew period - no combo item in cart');
        }
      });
  }

  convertCombosToItems(combos: Array<ComboInterface>): Array<CartComboItemModel> {
    const items: Array<CartComboItemModel> = [];

    combos.forEach((combo: ComboInterface) => {
      items.push(new CartComboItemModel(combo.id, combo.lines));
    });

    return items;
  }

  checkAndUpdateItems(cartItems: Array<CartItemModel>): Observable<CartItemModel[]> {
    return this.offeringsService.getActiveCombosMap()
      .first()
      .map((combosMap: OfferingsCombosMapInterface) => {
        let items = ObjectsUtil.deepClone(cartItems);

        // filter nonexistent combos
        items = items.filter((item: CartComboItemModel) => this.validateItem(item, combosMap));

        // clean draws
        items = items.map((item: CartComboItemModel) => {
          if (item.type !== 'combo') {
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

  generateShares(combo: OfferingsComboInterface | ComboItemModel): Array<{ template_id: number, num_shares: number}> {
    const shares = [];

    combo.items.forEach((item: { lottery_id: string, type: string, syndicate_template_id: number, items_qty: number }) => {
      if (item.type === 'shares') {
        shares.push({
          template_id: item.syndicate_template_id,
          num_shares: item.items_qty
        });
      }
    });

    return shares;
  }

  private validateItem(item: CartComboItemModel, combosMap: OfferingsCombosMapInterface): boolean {
    if (item.type !== 'combo') {
      return true;
    }

    if (!combosMap[item.comboId]) {
      return false;
    }

    return true;
  }
}
