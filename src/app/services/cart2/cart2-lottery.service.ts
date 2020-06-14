import { Injectable } from '@angular/core';

import { Cart2Service } from './cart2.service';
import { LinesService } from '../lines.service';
import { LotteriesService } from '../lotteries/lotteries.service';
import { CartItemModel } from '../../models/cart/cart-item.model';
import { CartLotteryItemModel } from '../../models/cart/cart-lottery-item.model';
import { LotteriesMapInterface } from '../lotteries/entities/interfaces/lotteries-map.interface';
import { OfferingsService } from '../offerings/offerings.service';
import { Observable } from 'rxjs/Observable';
import { ArraysUtil } from '../../modules/shared/utils/arrays.util';
import { LotteryInterface } from '../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { OfferFreeLinesInterface } from '../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { NumbersUtil } from '../../modules/shared/utils/numbers.util';
import { LineInterface } from '../../modules/api/entities/outgoing/common/line.interface';
import { ObjectsUtil } from '../../modules/shared/utils/objects.util';
import { CartSyndicateItemModel } from '../../models/cart/cart-syndicate-item.model';

@Injectable()
export class Cart2LotteryService {
  constructor(private cart2Service: Cart2Service,
              private offeringsService: OfferingsService,
              private linesService: LinesService,
              private lotteriesService: LotteriesService) {
  }

  getLotteries$(): Observable<string[]> {
    return this.cart2Service.getItems$()
      .map((items: Array<CartItemModel>) => items.filter((item: CartItemModel) => item.type === 'lottery'))
      .map((items: Array<CartLotteryItemModel>) => items.map((item: CartLotteryItemModel) => item.lotteryId));
  }

  getMinLotteryLinesNeedToBuy(lottery: LotteryInterface, items: Array<CartItemModel>): number {
    const lotteryInCart: CartLotteryItemModel | undefined = this.getLotteryItem(lottery.id, items);
    if (typeof lotteryInCart === 'undefined') {
      return lottery.rules.min_lines;
    }
    return lottery.rules.min_lines - lotteryInCart.lines.length;
  }

  getMinLotteryLinesCanToDelete(lottery: LotteryInterface, items: Array<CartItemModel>): number {
    const lotteryInCart: CartLotteryItemModel | undefined = this.getLotteryItem(lottery.id, items);
    if (typeof lotteryInCart === 'undefined') {
      return 1;
    }
    return lottery.rules.min_lines - lotteryInCart.lines.length === 0 ? lottery.rules.min_lines : 1;
  }

  getLotteryItem$(lotteryId: string): Observable<CartLotteryItemModel | undefined> {
    return this.cart2Service.getItems$()
      .map((items: Array<CartItemModel>) => this.getLotteryItem(lotteryId, items));
  }

  private getLotteryItem(lotteryId: string, items: Array<CartItemModel>): CartLotteryItemModel | undefined {
    return items
      .filter((item: CartItemModel) => item.type === 'lottery')
      .find((item: CartLotteryItemModel) => item.lotteryId === lotteryId) as CartLotteryItemModel;
  }

  getLessThanMinLotteryItems$(): Observable<any[]> {
    return combineLatest(
      this.cart2Service.getItems$(),
      this.lotteriesService.getSoldLotteriesMap(),
    )
      .map(([items, lotteriesMap]: [Array<CartItemModel>, LotteriesMapInterface]) => {
        return items
          .filter((item: CartItemModel) => item.type === 'lottery')
          .filter((item: CartLotteryItemModel) => {
            const lottery = lotteriesMap[item.lotteryId];

            if (!lottery) {
              throw new Error('No lottery for cart item');
            }

            if ((item.lines.length % lottery.rules.num_lines_multiple_of) !== 0) {
              return true;
            }

            return item.lines.length < lottery.rules.min_lines;
          });
      });
  }

  getLotteryLineIndex$(lotteryId: string, lineId: string): Observable<number> {
    return this.getLotteryItem$(lotteryId)
      .map((item: CartLotteryItemModel | undefined) => {
        if (typeof item !== 'undefined') {
          const length = item.lines.length;
          for (let i = 0; i < length; i++) {
            if (item.lines[i].id === lineId) {
              return i + 1;
            }
          }
        } else {
          throw new Error('No lottery in cart: ' + lotteryId);
        }
      });
  }

  getNumberOfLotteryLines$(lotteryId: string): Observable<number> {
    return this.getLotteryItem$(lotteryId)
      .map((item: CartLotteryItemModel | undefined) => {
        if (typeof item !== 'undefined') {
          return item.lines.length;
        } else {
          return 0;
        }
      });
  }

  changeRenewPeriod(lotteryId: string, renewPeriod: string | null): void {
    this.cart2Service.getItems$()
      .first()
      .subscribe((items: Array<CartItemModel>) => {
        const lotteryInCart: CartLotteryItemModel = this.getLotteryItem(lotteryId, items);

        if (typeof lotteryInCart !== 'undefined') {
          const updatedItems: Array<CartItemModel> = ObjectsUtil.deepClone(items);
          const updatedItem: CartLotteryItemModel = updatedItems
            .find((item: CartLotteryItemModel) => item.id === lotteryInCart.id) as CartLotteryItemModel;
          updatedItem.renewPeriod = renewPeriod;
          this.cart2Service.setItems(updatedItems);
        } else {
          throw new Error('Cant change renew period - no lottery in cart');
        }
      });
  }

  addItems(addedItems: Array<CartLotteryItemModel>, updateRenewPeriod = true): void {
    combineLatest(
      this.cart2Service.getItems$(),
      this.lotteriesService.getSoldLotteriesMap(),
    )
      .first()
      .subscribe(([items, lotteriesMap]: [Array<CartItemModel>, LotteriesMapInterface]) => {
        addedItems.forEach((addedItem: CartLotteryItemModel) => {
          if (!this.validateItem(addedItem, lotteriesMap)) {
            return;
          }

          this.offeringsService.getLotteryFreeLinesOffer(addedItem.lotteryId)
            .first()
            .subscribe((freeLinesOffer: OfferFreeLinesInterface | null) => {
              const lottery: LotteryInterface | undefined = lotteriesMap[addedItem.lotteryId];
              if (typeof lottery !== 'undefined') {
                const lotteryInCart: CartLotteryItemModel = this.getLotteryItem(addedItem.lotteryId, items);
                const minLinesNeedToBuy = this.getMinLotteryLinesNeedToBuy(lottery, items);

                if (typeof lotteryInCart !== 'undefined') {
                  const updatedItems: Array<CartItemModel> = ObjectsUtil.deepClone(items);
                  const updatedItem: CartLotteryItemModel = updatedItems
                    .find((item: CartLotteryItemModel) => item.id === lotteryInCart.id) as CartLotteryItemModel;
                  updatedItem.addLines(addedItem.lines);
                  if (updateRenewPeriod === true) {
                    updatedItem.renewPeriod = addedItem.renewPeriod;
                  }
                  updatedItem.lines = this.addToMinLines(minLinesNeedToBuy, updatedItem.lotteryId, updatedItem.lines);
                  updatedItem.lines = this.manipulateFreeLines(updatedItem.lotteryId, updatedItem.lines, freeLinesOffer);
                  updatedItem.lines = this.createEqualPerTicketNumbersValue(updatedItem.lines);

                  this.cart2Service.setItems(updatedItems);
                } else {
                  addedItem.lines = this.addToMinLines(minLinesNeedToBuy, addedItem.lotteryId, addedItem.lines);
                  addedItem.lines = this.manipulateFreeLines(addedItem.lotteryId, addedItem.lines, freeLinesOffer);
                  addedItem.lines = this.createEqualPerTicketNumbersValue(addedItem.lines);

                  this.cart2Service.addItems([addedItem]);
                }
              }
            });
        });
      });
  }

  createEqualPerTicketNumbersValue(lines) {
    const arr = [];
    lines.forEach(line => {
      if (typeof line.perticket_numbers !== 'undefined' && line.perticket_numbers.length !== 0) {
        arr.push(line.perticket_numbers);
      }
    });

    if (arr.length !== 0) {
      lines = lines.map(line => {
        line.perticket_numbers = arr[arr.length - 1];
        return line;
      });
    }

    return lines;
  }

  deleteLottery(lotteryId: string): void {
    this.cart2Service.getItems$()
      .first()
      .subscribe((items: Array<CartItemModel>) => {
        const updatedItems: Array<CartItemModel> = ObjectsUtil.deepClone(items)
          .filter((item: CartLotteryItemModel) => {
            return item.type !== 'lottery' || item.lotteryId !== lotteryId;
          });
        this.cart2Service.setItems(updatedItems);
      });
  }

  deleteLines(lotteryId: string, lineIds: Array<string>): void {
    combineLatest(
      this.cart2Service.getItems$(),
      this.lotteriesService.getSoldLotteriesMap(),
      this.offeringsService.getLotteryFreeLinesOffer(lotteryId),
    )
      .first()
      .subscribe(([items, lotteriesMap, freeLinesOffer]: [
        Array<CartItemModel>,
        LotteriesMapInterface,
        OfferFreeLinesInterface | null]) => {
        const lotteryInCart: CartLotteryItemModel = this.getLotteryItem(lotteryId, items);

        if (typeof lotteryInCart !== 'undefined' && typeof lotteriesMap[lotteryId] !== 'undefined') {
          const updatedItems: Array<CartItemModel> = ObjectsUtil.deepClone(items);
          const updatedItem: CartLotteryItemModel = updatedItems
            .find((item: CartLotteryItemModel) => item.id === lotteryInCart.id) as CartLotteryItemModel;

          if (this.getMinLotteryLinesCanToDelete(lotteriesMap[lotteryId], items) <= lineIds.length) {
            updatedItem.deleteLines(lineIds);

            if (updatedItem.lines.length === 0) {
              this.deleteLottery(lotteryId);
            } else {
              updatedItem.lines = this.manipulateFreeLines(updatedItem.lotteryId, updatedItem.lines, freeLinesOffer);
              this.cart2Service.setItems(updatedItems);
            }
          }
        }
      });
  }

  convertLinesToItems(lines: Array<LineInterface>): Array<CartLotteryItemModel> {
    const items: Array<CartLotteryItemModel> = [];

    lines.forEach((line: LineInterface) => {
      const lotteryItem: CartLotteryItemModel = this.getLotteryItem(line.lottery_id, items);

      if (typeof lotteryItem !== 'undefined') {
        lotteryItem.addLines([line]);
      } else {
        items.push(new CartLotteryItemModel(line.lottery_id, [line]));
      }
    });

    return items;
  }

  checkAndUpdateItems(cartItems: Array<CartItemModel>): Observable<CartItemModel[]> {
    return combineLatest(
      this.lotteriesService.getSoldLotteriesMap(),
      this.offeringsService.getFreeLinesOffersMap()
    )
      .first()
      .map(([lotteriesMap, freeLinesOffersMap]) => {
        let items = ObjectsUtil.deepClone(cartItems);

        // filter nonexistent lotteries
        items = items
          .filter((item: CartLotteryItemModel) => this.validateItem(item, lotteriesMap));

        // add to min lines
        items = items.map((item: CartLotteryItemModel) => {
          if (item.type !== 'lottery') {
            return item;
          }
          const lotteryId = item.lotteryId;
          const minLinesNeedToBuy = lotteriesMap[lotteryId] ? lotteriesMap[lotteryId].rules.min_lines : 1;
          while (item.lines.length < minLinesNeedToBuy) {
            item.lines.push(this.linesService.generateAutoselectedLine(lotteryId));
          }
          return item;
        });

        // free lines
        items = items.map((item: CartLotteryItemModel) => {
          if (item.type !== 'lottery') {
            return item;
          }
          const lotteryId = item.lotteryId;
          item.lines = this.restoreFreeLines(lotteryId, item.lines, freeLinesOffersMap[lotteryId]);
          return item;
        });

        // clean draws
        items = items.map((item: CartLotteryItemModel) => {
          if (item.type !== 'lottery') {
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

  private validateItem(item: CartLotteryItemModel, lotteriesMap: LotteriesMapInterface): boolean {
    if (item.type !== 'lottery') {
      return true;
    }

    if (!lotteriesMap[item.lotteryId]) {
      return false;
    }

    return true;
  }

  updateLine(lotteryId: string, line: LineInterface): void {
    this.cart2Service.getItems$()
      .first()
      .subscribe((items: Array<CartItemModel>) => {
        const lotteryInCart: CartLotteryItemModel = this.getLotteryItem(lotteryId, items);

        if (typeof lotteryInCart !== 'undefined') {
          const updatedItems: Array<CartItemModel> = ObjectsUtil.deepClone(items);
          const updatedItem: CartLotteryItemModel = updatedItems
            .find((item: CartLotteryItemModel) => item.id === lotteryInCart.id) as CartLotteryItemModel;
          updatedItem.updateLine(line);
          this.cart2Service.setItems(updatedItems);
        } else {
          throw new Error('Cant update line in cart - no lottery in cart');
        }
      });
  }

  createMinLotteryItem(lottery: LotteryInterface,
                       items: Array<CartItemModel>,
                       animate: boolean = false,
                       linesAmount?: number): CartLotteryItemModel {
    const filledLines = [];
    let minLinesNeedToBuy = this.getMinLotteryLinesNeedToBuy(lottery, items);
    if (linesAmount) {
      minLinesNeedToBuy = linesAmount;
    }
    if (minLinesNeedToBuy > 0) {
      while (filledLines.length < minLinesNeedToBuy) {
        filledLines.push(this.linesService.generateAutoselectedLine(lottery.id));
      }
    } else {
      filledLines.push(this.linesService.generateAutoselectedLine(lottery.id));
    }

    if (lottery.rules.perticket_numbers) {
      filledLines.map(line => {
        line.perticket_numbers = this.autoSelectPerTicketNumbers(lottery);
      });
    }

    return new CartLotteryItemModel(lottery.id, filledLines, null, animate);
  }

  autoSelectPerTicketNumbers(lottery: LotteryInterface) {
    return NumbersUtil.getRandomUniqueNumbersArray(
      [],
      lottery.rules.perticket_numbers.picks,
      lottery.rules.perticket_numbers.lowest,
      lottery.rules.perticket_numbers.highest
    );
  }

  private addToMinLines(minLinesNeedToBuy: number, lotteryId: string, filledLines: Array<LineInterface>): Array<LineInterface> {
    if (minLinesNeedToBuy > 0) {
      while (filledLines.length < minLinesNeedToBuy) {
        filledLines.push(this.linesService.generateAutoselectedLine(lotteryId));
      }
    }

    return filledLines;
  }

  manipulateFreeLines(lotteryId: string,
                      linesList: Array<LineInterface>,
                      freeLinesOffer: OfferFreeLinesInterface | null): Array<LineInterface> {
    // Check is set offer
    if (!freeLinesOffer) {
      return linesList;
    }

    const nonLotteryLines: Array<LineInterface> = linesList.filter(line => line.lottery_id !== lotteryId || !line.isFree);
    const nonFreeLines: Array<LineInterface> = linesList.filter(line => line.lottery_id === lotteryId).filter(line => !line.isFree);
    let freeLines: Array<LineInterface> = linesList.filter(line => line.lottery_id === lotteryId).filter(line => line.isFree);

    let openedFreeLinesNumber: number;
    if (freeLinesOffer.details.is_multiplied) {
      openedFreeLinesNumber = Math.floor(nonFreeLines.length / freeLinesOffer.details.lines_to_qualify)
        * freeLinesOffer.details.lines_free;
    } else {
      openedFreeLinesNumber = Math.floor(nonFreeLines.length / freeLinesOffer.details.lines_to_qualify) >= 1
        ? freeLinesOffer.details.lines_free
        : 0;
    }

    if (freeLines.length < openedFreeLinesNumber) {
      // Add free lines
      const addFreeLines = openedFreeLinesNumber - freeLines.length;
      for (let i = 0; i < addFreeLines; i++) {
        freeLines.push(this.linesService.generateAutoselectedFreeLine(lotteryId));
      }
    } else {
      // remove free lines
      freeLines = freeLines.slice(0, openedFreeLinesNumber);
    }
    return [...nonLotteryLines, ...freeLines];
  }

  restoreFreeLines(lotteryId: string,
                   linesList: Array<LineInterface>,
                   freeLinesOffer: OfferFreeLinesInterface | null): Array<LineInterface> {
    // reset free lines
    linesList = linesList.map(line => {
      line.isFree = false;
      return line;
    });

    // Check is set offer
    if (!freeLinesOffer) {
      return linesList;
    }

    const lotteryLines = linesList.filter(line => line.lottery_id === lotteryId);
    const lotteryLinesNumber = lotteryLines.length;
    const numberOfPacks = Math.floor(lotteryLinesNumber / (freeLinesOffer.details.lines_to_qualify + freeLinesOffer.details.lines_free));

    if (numberOfPacks < 1) {
      return linesList;
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

    return linesList;
  }
}
