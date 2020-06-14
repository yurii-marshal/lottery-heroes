import { Component, ChangeDetectionStrategy, OnInit, HostListener, NgZone } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { CartPageSandbox } from './cart-page.sandbox';
import { AnalyticsDeprecatedService } from '../../modules/analytics-deprecated/services/analytics-deprecated.service';
import { ArraysUtil } from '../../modules/shared/utils/arrays.util';

import { SegmentationIdsInterface } from '../../services/lotteries/entities/interfaces/segmentation.interface';
import { LotteriesMapInterface } from '../../services/lotteries/entities/interfaces/lotteries-map.interface';
import { OfferingsCombosMapInterface } from '../../services/offerings/entities/offerings-combos-map.interface';
import { CartLotteryItemModel } from '../../models/cart/cart-lottery-item.model';
import { CartComboItemModel } from '../../models/cart/cart-combo-item.model';
import {
  OfferingsSubscriptionDiscountInterface
} from '../../modules/api/entities/incoming/offerings/offerings-subscription-discounts.interface';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { LineInterface } from '../../modules/api/entities/outgoing/common/line.interface';
import { OfferingsComboInterface } from '../../modules/api/entities/incoming/offerings/offerings-combos.interface';

@Component({
  selector: 'app-cart-page-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-cart-page-component
      [expandedLines]="expandedLines"
    ></app-cart-page-component>`,
})
export class CartPageContainerComponent implements OnInit {
  expandedLines = false;

  @HostListener('window:beforeunload')
  onBeforeUnloadWindow() {
    this.analyticsDeprecatedService.trackClosingBrowserInCart();
  }

  @HostListener('window:popstate')
  onPopstateWindow() {
    this.analyticsDeprecatedService.trackClickBackButtonInCart();
  }

  constructor(private sandbox: CartPageSandbox,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private zone: NgZone) {
  }

  ngOnInit(): void {
    this.sandbox.setMeta();

    this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('bundles') || paramMap.has('combos')) {
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.zone.run(() => {
              if (paramMap.has('skip')) {
                this.sandbox.setSkipFirstDrawParam(paramMap.get('skip'));
              }

              if (!paramMap.has('add')) {
                this.sandbox.clearCart();
              }

              if (paramMap.has('expand')) {
                this.expandedLines = true;
              }

              forkJoin(
                this.addBundleFromQuery(),
                this.addBundleWithNumbersFromQuery(),
                this.addComboFromQuery(),
              ).subscribe((data: Array<boolean>) => {
                return this.router.navigateByUrl('/cart');
              });
            });
          }, 0);
        });
      }
    });
  }

  private addBundleFromQuery(): Observable<boolean> {
    return combineLatest(
      this.activatedRoute.queryParamMap,
      this.sandbox.getSegmentationIdsMap$(),
      this.sandbox.getLotteriesMap$(),
      this.sandbox.getSubscriptionRenewPeriods(),
    )
      .first()
      .map(([paramMap,
              segmentationIdsMap,
              lotteriesMap,
              subscriptionRenewPeriods]: [
        ParamMap,
        SegmentationIdsInterface,
        LotteriesMapInterface,
        Array<OfferingsSubscriptionDiscountInterface>]) => {

        let result = false;

        if (paramMap.has('bundles')) {
          const bundles = paramMap.get('bundles').match(/\(\d+-\d+(-\d+)?\)/g);
          if (bundles !== null) {
            const addItems: Array<CartLotteryItemModel> = [];

            bundles
              .map((bundle: string) => bundle
                .substr(1, bundle.length - 2)
                .split('-')
                .map(data => parseInt(data, 10))
                .slice(0, 3)
                .filter(data => !isNaN(data))
              )
              .map((bundle: [number, number, number | undefined]) => bundle.map((data, index) => index === 0
                ? data.toString() : data))
              .map((bundle: [string, number, number | undefined]) => {
                bundle[0] = segmentationIdsMap[bundle[0]];
                return bundle;
              })
              .filter((bundle: [string, number, number | undefined]) => typeof bundle[0] !== 'undefined' && bundle.length >= 2)
              .filter((bundle: [string, number, number | undefined]) => ArraysUtil.inArray(Object.keys(lotteriesMap), bundle[0]))
              .forEach(([lotteryId, numberOfLines, subscriptionIndex]: [string, number, number | undefined]) => {
                try {
                  subscriptionIndex = subscriptionIndex - 2;
                  let renewPeriods = subscriptionRenewPeriods
                    .filter((value: OfferingsSubscriptionDiscountInterface) => value.lottery_id === lotteryId);
                  if (renewPeriods.length === 0) {
                    renewPeriods = subscriptionRenewPeriods
                      .filter((value: OfferingsSubscriptionDiscountInterface) => value.lottery_id === null);
                  }
                  const lastPeriod = renewPeriods[renewPeriods.length - 1];

                  const lines = this.sandbox.generateAutoselectedLines(lotteryId, numberOfLines);
                  const item = new CartLotteryItemModel(lotteryId, lines);

                  if (typeof subscriptionIndex !== 'undefined' && subscriptionIndex >= 0) {
                    if (typeof renewPeriods[subscriptionIndex] !== 'undefined') {
                      item.renewPeriod = renewPeriods[subscriptionIndex].period;
                    } else {
                      item.renewPeriod = lastPeriod ? lastPeriod.period : null;
                    }
                  }

                  addItems.push(item);
                } catch (e) {
                  // error generating line
                  console.error(e);
                }
              });

            if (addItems.length > 0) {
              this.sandbox.addToCart('lottery', addItems);
              result = true;
            }
          }
        }

        return result;
      });
  }

  /**
   * cart?bundles=(X-Y-Z-[A-B-C-D-E-F][H-J-K-L-M-N])
   * lotid - X = represents the id of the lottery (like we use in the homepage)
   * Y = represents the number of lines to be added for the X lottery
   * Z = represents the number of draws to be chosen for the bundle
   * A-F, H-N = represent numbers for each line. Main numbers are listed first,
   * then the extra numbers. If there's not enough numbers in the link - missing ones
   * (main or extra) should be generated automatically
   * cart?bundles=(4-1-2-[1-3-5-7-9-1-2])(5-2-1-[1-2-3-4-5-6][11-12-13-14-15-16])
   * skip=true - to skip first draw
   */
  private addBundleWithNumbersFromQuery(): Observable<boolean> {
    return combineLatest(
      this.activatedRoute.queryParamMap,
      this.sandbox.getSegmentationIdsMap$(),
      this.sandbox.getLotteriesMap$(),
      this.sandbox.getSubscriptionRenewPeriods(),
    )
      .first()
      .map(([paramMap, segmentationIdsMap, lotteriesMap, subscriptionRenewPeriods]: [
        ParamMap,
        SegmentationIdsInterface,
        LotteriesMapInterface,
        Array<OfferingsSubscriptionDiscountInterface>]) => {
        let result = false;

        if (paramMap.has('bundles')) {
          const bundlesWithNumbers = paramMap.get('bundles').match(/\(\d+-\d+(-\d+)?-(\[(\d+-)+\d+])+\)/g);

          if (bundlesWithNumbers !== null) {
            const addItems: Array<CartLotteryItemModel> = [];

            bundlesWithNumbers
              .forEach((bundle: string) => {
                const bundleData = bundle
                  .match(/\(\d+-\d+(-\d+)?-/g)[0]
                  .substr(1, bundle.length - 2)
                  .split('-')
                  .map(data => parseInt(data, 10))
                  .slice(0, 3)
                  .filter(data => !isNaN(data));

                if (bundleData.length >= 2) {
                  const lotteryId = segmentationIdsMap[bundleData[0].toString()];
                  const numberOfLines = bundleData[1];
                  const lineNumbers = this.getNumbersFromQuery(bundle);

                  const subscriptionIndex = bundleData[2] - 2;
                  let renewPeriods = subscriptionRenewPeriods
                    .filter((value: OfferingsSubscriptionDiscountInterface) => value.lottery_id === lotteryId);
                  if (renewPeriods.length === 0) {
                    renewPeriods = subscriptionRenewPeriods
                      .filter((value: OfferingsSubscriptionDiscountInterface) => value.lottery_id === null);
                  }
                  const lastPeriod = renewPeriods[renewPeriods.length - 1];


                  if (ArraysUtil.inArray(Object.keys(lotteriesMap), lotteryId)) {
                    try {
                      const lines = [];
                      for (let i = 0; i < numberOfLines; i++) {
                        let line: LineInterface;

                        if (typeof lineNumbers[i] !== 'undefined') {
                          const extraNumbers = lineNumbers[i]
                            .slice(lotteriesMap[lotteryId].rules.main_numbers.picks);

                          line = this.sandbox.generateLine(lotteryId, lineNumbers[i], extraNumbers);
                          line = this.sandbox.autoselectLine(line);
                        } else {
                          line = this.sandbox.generateAutoselectedLines(lotteryId, 1)[0];
                        }

                        lines.push(line);
                      }
                      const item = new CartLotteryItemModel(lotteryId, lines);

                      if (typeof subscriptionIndex !== 'undefined' && subscriptionIndex >= 0) {
                        if (typeof renewPeriods[subscriptionIndex] !== 'undefined') {
                          item.renewPeriod = renewPeriods[subscriptionIndex].period;
                        } else {
                          item.renewPeriod = lastPeriod ? lastPeriod.period : null;
                        }
                      }

                      addItems.push(item);
                    } catch (e) {
                      // error generating line
                      console.error(e);
                    }
                  }
                }
              });


            if (addItems.length > 0) {
              this.sandbox.addToCart('lottery', addItems);
              result = true;
            }
          }
        }

        return result;
      });
  }

  private addComboFromQuery(): Observable<boolean> {
    return combineLatest(
      this.activatedRoute.queryParamMap,
      this.sandbox.getActiveCombosMap$(),
      this.sandbox.getSubscriptionRenewPeriods(),
    )
      .first()
      .map(([paramMap,
              combosMap,
              subscriptionRenewPeriods]: [ParamMap, OfferingsCombosMapInterface, Array<OfferingsSubscriptionDiscountInterface>]) => {
        let result = false;

        if (paramMap.has('combos')) {
          const combos = paramMap.get('combos').match(/\(\d+(-\d+)?\)/g);
          if (combos !== null) {
            const addItems: Array<CartComboItemModel> = [];

            combos
              .map((combo: string) => combo
                .substr(1, combo.length - 1)
                .split('-')
                .map(data => parseInt(data, 10))
                .slice(0, 2)
                .filter(data => !isNaN(data))
              )
              .map((combo: [any, number | undefined]) => {
                combo[0] = combosMap[combo[0]];
                return combo;
              })
              .filter((combo: [OfferingsComboInterface, number | undefined]) => typeof combo[0] !== 'undefined'
                && combo.length >= 1)
              .forEach(([combo, subscriptionIndex]: [OfferingsComboInterface, number | undefined]) => {
                try {
                  subscriptionIndex = subscriptionIndex - 2;
                  subscriptionRenewPeriods = subscriptionRenewPeriods
                    .filter((value: OfferingsSubscriptionDiscountInterface) => value.lottery_id === null);
                  const lastPeriod = subscriptionRenewPeriods[subscriptionRenewPeriods.length - 1];
                  const lines = this.sandbox.generateComboLines(combo);
                  const item = new CartComboItemModel(combo.id, lines);
                  /*if (typeof subscriptionIndex !== 'undefined' && subscriptionIndex >= 0) {
                    if (typeof subscriptionRenewPeriods[subscriptionIndex] !== 'undefined') {
                      item.renewPeriod = subscriptionRenewPeriods[subscriptionIndex].period;
                    } else {
                      item.renewPeriod = lastPeriod ? lastPeriod.period : null;
                    }
                  }*/
                  addItems.push(item);
                } catch (e) {
                  // error generating line
                  console.error(e);
                }
              });

            if (addItems.length > 0) {
              this.sandbox.addToCart('combo', addItems);
              result = true;
            }
          }
        }

        return result;
      });
  }

  /**
   * Extract and numbers from query item
   * @param {string} queryItem is something like (4-1-2-[1-3-5-7-9-1-2][11-12-13-14-15-16])
   * @returns Array of line numbers
   */
  private getNumbersFromQuery(queryItem: string): Array<number[]> {
    return queryItem
      .match(/\[(\d+-)+\d+\]/g)
      .map((nums: string) => nums
        .substr(1, nums.length - 2)
        .split('-')
        .map(data => parseInt(data, 10))
        .filter(data => !isNaN(data))
      );
  }
}
