import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Observable} from 'rxjs/Observable';
import {IdUtil} from '../../modules/shared/utils/id.util';
import {OfferingsService} from '../offerings/offerings.service';
import {ArraysUtil} from '../../modules/shared/utils/arrays.util';
import {CartItemModel} from '../../models/cart/cart-item.model';
import {CartLotteryItemModel} from '../../models/cart/cart-lottery-item.model';
import {CartComboItemModel} from '../../models/cart/cart-combo-item.model';
import {CartItemsInterface} from '../../modules/api/entities/cart-items.interface';
import {CartApiService} from '../../modules/api/cart.api.service';
import {ComboInterface} from '../../modules/api/entities/outgoing/common/combo.interface';
import {SubscriptionInterface} from '../../modules/api/entities/outgoing/common/subscription.interface';
import {OfferingsFreeLinesOffersMapInterface} from '../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import {LineInterface} from '../../modules/api/entities/outgoing/common/line.interface';
import {CartSyndicateItemModel} from '../../models/cart/cart-syndicate-item.model';
import {CartBundleItemModel} from '../../models/cart/cart-bundle-item.model';
import {BundleInterface} from '../../modules/api/entities/outgoing/common/bundle.interface';

@Injectable()
export class CartCustomerService {
  private customerCartSubject$: ReplaySubject<CartItemsInterface>;

  constructor(private cartApiService: CartApiService,
              private offeringsService: OfferingsService) {
    this.customerCartSubject$ = new ReplaySubject(1);
  }

  setCustomerCart(cart: CartItemsInterface | undefined): void {
    if (typeof cart !== 'undefined') {
      this.offeringsService.getFreeLinesOffersMap()
        .subscribe((freeLinesOffersMap: OfferingsFreeLinesOffersMapInterface) => {
          cart = this.adoptCustomerCart(cart);
          cart.lines = this.restoreFreeLines(cart.lines, freeLinesOffersMap);
          this.customerCartSubject$.next(cart);
        });
    } else {
      this.loadCustomerCart();
    }
  }

  private loadCustomerCart(): void {
    this.cartApiService.getCustomerCart()
      .subscribe((cart: CartItemsInterface) => this.setCustomerCart(cart));
  }

  private adoptCustomerCart(cart: CartItemsInterface): CartItemsInterface {
    if (cart.lines) {
      cart.lines = cart.lines.map((line: LineInterface) => {
        line.id = line.id || IdUtil.generateUniqueId();
        line.isFree = false;
        line.perticket_numbers = line.perticket_numbers || [];
        return line;
      });
    }

    if (cart.combos) {
      cart.combos = cart.combos.map((combo: ComboInterface) => {
        combo.lines = combo.lines.map((line: LineInterface) => {
          line.id = line.id || IdUtil.generateUniqueId();
          line.isFree = false;
          line.perticket_numbers = line.perticket_numbers || [];
          return line;
        });
        return combo;
      });
    }

    if (cart.bundles) {
      cart.bundles = cart.bundles.map((bundle: BundleInterface) => {
        bundle.lines = bundle.lines.map((line: LineInterface) => {
          line.id = line.id || IdUtil.generateUniqueId();
          line.isFree = false;
          line.perticket_numbers = line.perticket_numbers || [];
          return line;
        });
        return bundle;
      });
    }

    if (cart.subscriptions) {
      cart.subscriptions = cart.subscriptions.map((subsciption: SubscriptionInterface) => {
        subsciption.lines = subsciption.lines.map((line: LineInterface) => {
          line.id = line.id || IdUtil.generateUniqueId();
          line.isFree = false;
          line.perticket_numbers = line.perticket_numbers || [];
          return line;
        });

        subsciption.combos = subsciption.combos.map((combo: ComboInterface) => {
          combo.lines = combo.lines.map((line: LineInterface) => {
            line.id = line.id || IdUtil.generateUniqueId();
            line.isFree = false;
            line.perticket_numbers = line.perticket_numbers || [];
            return line;
          });
          return combo;
        });

        subsciption.bundles = subsciption.bundles.map((bundle: BundleInterface) => {
          bundle.lines = bundle.lines.map((line: LineInterface) => {
            line.id = line.id || IdUtil.generateUniqueId();
            line.isFree = false;
            line.perticket_numbers = line.perticket_numbers || [];
            return line;
          });
          return bundle;
        });

        return subsciption;
      });
    }

    return cart;
  }

  private linesListToLotteryMap(lines: Array<LineInterface>): { [lotteryId: string]: Array<LineInterface> } {
    return lines.reduce((resultMap, line: LineInterface) => {
      return Object.assign(resultMap, {
        [line.lottery_id]: (!!resultMap[line.lottery_id] ? [...resultMap[line.lottery_id], line] : [line])
      });
    }, {});
  }

  private restoreFreeLines(linesList: Array<LineInterface>,
                           freeLinesOffersMap: OfferingsFreeLinesOffersMapInterface): Array<LineInterface> {
    const lotteryLinesMap = this.linesListToLotteryMap(linesList);

    Object.keys(lotteryLinesMap).forEach((lotteryId) => {
      // Check isset offer
      const freeLinesOffer = freeLinesOffersMap[lotteryId];
      if (typeof freeLinesOffer === 'undefined') {
        return;
      }

      const lotteryLines = lotteryLinesMap[lotteryId];
      const lotteryLinesNumber = lotteryLines.length;
      const numberOfPacks = Math.floor(lotteryLinesNumber / (freeLinesOffer.details.lines_to_qualify + freeLinesOffer.details.lines_free));

      if (numberOfPacks < 1) {
        return;
      }

      // Free lines number
      let freeLinesNumber: number;
      if (freeLinesOffer.details.is_multiplied === true) {
        freeLinesNumber = numberOfPacks * freeLinesOffer.details.lines_free;
      } else {
        freeLinesNumber = freeLinesOffer.details.lines_free;
      }

      // Set free lines
      const freeLineIds = lotteryLines.slice(-freeLinesNumber).map(item => item.id);
      linesList = linesList.map((line: LineInterface) => {
        if (ArraysUtil.inArray(freeLineIds, line.id)) {
          line.isFree = true;
        }
        return line;
      });
    });

    return linesList;
  }

  getCustomerCart$(): Observable<CartItemsInterface> {
    return this.customerCartSubject$.asObservable();
  }

  updateCustomerCart(itemsList: Array<CartItemModel>): void {
    // console.log(itemsList);
    const lines = itemsList
      .filter(item => item.type === 'lottery')
      .filter(item => (<CartLotteryItemModel>item).renewPeriod === null)
      .reduce((accumulator: Array<LineInterface>, item: CartLotteryItemModel) => {
        return [...accumulator, ...item.lines];
      }, []);

    const combos = itemsList
      .filter(item => item.type === 'combo')
      .filter(item => (<CartComboItemModel>item).renewPeriod === null)
      .map((item: CartComboItemModel) => item.getComboObject());

    const bundles = itemsList
      .filter(item => item.type === 'bundle')
      .filter(item => (<CartBundleItemModel>item).renewPeriod === null)
      .map((item: CartBundleItemModel) => item.getBundleObject());

    const subscriptions = itemsList
      .filter(item => {
        return typeof item.getSerializedObject().renewPeriod !== 'undefined' &&
          item.getSerializedObject().renewPeriod !== null;
      })
      .map((item: CartItemModel) => {
        if (item.type === 'lottery') {
          return {
            renew_period: (<CartLotteryItemModel>item).renewPeriod,
            lines: (<CartLotteryItemModel>item).lines,
            combos: [],
          };
        }

        if (item.type === 'combo') {
          return {
            renew_period: (<CartComboItemModel>item).renewPeriod,
            lines: [],
            combos: [(<CartComboItemModel>item).getComboObject()],
          };
        }

        if (item.type === 'bundle') {
          return {
            renew_period: (<CartBundleItemModel>item).renewPeriod,
            lines: [],
            bundles: [(<CartBundleItemModel>item).getBundleObject()],
          };
        }
      });

    const shares = itemsList
      .filter(item => item.type === 'syndicate')
      .map((item: CartSyndicateItemModel) => item.getSerializedObject());

    this.cartApiService.updateCustomerCart({lines, combos, bundles, subscriptions, shares}).subscribe();
  }
}
