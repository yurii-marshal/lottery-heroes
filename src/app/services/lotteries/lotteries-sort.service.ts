import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { LotteriesService } from './lotteries.service';
import { DrawsService } from './draws.service';

import { LotteriesSortByType } from './entities/types/lotteries-sort-by.type';
import { LotteriesMapInterface } from './entities/interfaces/lotteries-map.interface';

import { ObjectsUtil } from '../../modules/shared/utils/objects.util';
import { ArraysUtil } from '../../modules/shared/utils/arrays.util';
import { OfferingsService } from '../offerings/offerings.service';
import { BrandParamsService } from '../../modules/brand/services/brand-params.service';

import { Cart2LotteryService } from '../cart2/cart2-lottery.service';
import { DrawInterface } from '../../modules/api/entities/incoming/lotteries/draws.interface';
import { OfferingsFreeLinesOffersMapInterface } from '../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';
import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';
import { BrandQueryService } from '@libs/biglotteryowin-core/services/queries/brand-query.service';
import { Cart2SyndicateService } from '../cart2/cart2-syndicate.service';
import { CartSyndicateItemModel } from '../../models/cart/cart-syndicate-item.model';

@Injectable()
export class LotteriesSortService {
  private lotteriesSortBySubject$: BehaviorSubject<LotteriesSortByType>;
  private lotteriesSortBy$: Observable<LotteriesSortByType>;

  constructor(private lotteriesService: LotteriesService,
              private drawsService: DrawsService,
              private offeringsService: OfferingsService,
              private brandParamsService: BrandParamsService,
              private cart2LotteryService: Cart2LotteryService,
              private syndicatesQueryService: SyndicatesQueryService,
              private brandQueryService: BrandQueryService,
              private cart2SyndicateService: Cart2SyndicateService) {
    this.lotteriesSortBySubject$ = new BehaviorSubject(<LotteriesSortByType>'jackpot');
    this.lotteriesSortBy$ = this.lotteriesSortBySubject$.asObservable();
  }

  private getSortedLotteriesIds(sortBy: LotteriesSortByType,
                                lotteriesMap: LotteriesMapInterface,
                                drawsList: Array<DrawInterface>): Observable<string[]> {
    let result = of([]);
    switch (sortBy) {
      case 'odds':
        const lotteriesIds = drawsList.map((draw: DrawInterface) => draw.lottery_id);
        result = of(lotteriesIds.sort((a: string, b: string) => {
          const maxOddA = ObjectsUtil.getValues(lotteriesMap[a].odds).sort((x: number, y: number) => y - x)[0];
          const maxOddB = ObjectsUtil.getValues(lotteriesMap[b].odds).sort((x: number, y: number) => y - x)[0];
          return maxOddA - maxOddB;
        }));
        break;
      case 'dateasc':
        result = of(
          // tslint:disable-next-line:max-line-length
          drawsList.sort((a: DrawInterface, b: DrawInterface) => new Date(a.last_ticket_time).getTime() - new Date(b.last_ticket_time).getTime())
            .map((draw: DrawInterface) => draw.lottery_id));
        break;
      case 'datedesc':
        result = of(
          // tslint:disable-next-line:max-line-length
          drawsList.sort((a: DrawInterface, b: DrawInterface) => new Date(b.last_ticket_time).getTime() - new Date(a.last_ticket_time).getTime())
            .map((draw: DrawInterface) => draw.lottery_id));
        break;
      case 'jackpot':
        result = of(
          ObjectsUtil.deepClone(drawsList)
            .map((draw: DrawInterface) => {
              if (!draw.jackpot) {
                draw.jackpot = lotteriesMap[draw.lottery_id].min_prize;
              }
              return draw;
            })
            .sort((a: DrawInterface, b: DrawInterface) => b[sortBy] - a[sortBy])
            .map((draw: DrawInterface) => draw.lottery_id));
        break;
      case 'offers':
        result = combineLatest(
          this.getPopularUpcomingLotteryIds(),
          this.offeringsService.getFreeLinesOffersMap()
        ).map(data => {
          const popularIds = data[0];
          const freeLineOffersMap = data[1];

          for (let i = 0; i < popularIds.length; i++) {
            if (Object.keys(freeLineOffersMap)[i]) {
              Object.assign(freeLineOffersMap[Object.keys(freeLineOffersMap)[i]], {
                sortedIndex: popularIds.indexOf(Object.keys(freeLineOffersMap)[i])
              });
            }
          }

          const diff = function (a, b) {
            return freeLineOffersMap[a]['sortedIndex'] - freeLineOffersMap[b]['sortedIndex'];
          };

          return ArraysUtil.union(Object.keys(freeLineOffersMap).sort(diff), ArraysUtil.union(popularIds, Object.keys(lotteriesMap)));
        });

        break;
    }

    return result;
  }

  setLotteriesSortBy(sortBy: LotteriesSortByType): void {
    if (ArraysUtil.inArray(['jackpot', 'dateasc', 'datedesc', 'odds', 'offers', 'closing'], sortBy)) {
      this.lotteriesSortBySubject$.next(sortBy);
    }
  }

  getLotteriesSortBy(): Observable<LotteriesSortByType> {
    return this.lotteriesSortBy$;
  }

  getLotteriesIdsSortedList(drawsType: 'upcoming' | 'latest', allLotteries = false, sortBy?: LotteriesSortByType): Observable<string[]> {
    let drawsList$: Observable<DrawInterface[]>;

    switch (drawsType) {
      case 'upcoming':
        drawsList$ = this.drawsService.getUpcomingDrawsList();
        break;
      case 'latest':
        drawsList$ = this.drawsService.getLatestDrawsList();
        break;
    }

    return combineLatest(
      sortBy ? of(sortBy) : this.lotteriesSortBy$,
      allLotteries ? this.lotteriesService.getLotteriesMap() : this.lotteriesService.getSoldLotteriesMap(),
      drawsList$,
      this.syndicatesQueryService.getSyndicateModelsMap()
    ).switchMap(data => {
      const lotteriesSortBy: LotteriesSortByType = data[0];
      const lotteriesMap: LotteriesMapInterface = data[1];
      const syndicates: any | {[id: string]: SyndicateModel} = data[3];
      let syndicateIds = [];

      if (typeof syndicates !== 'undefined' && syndicates !== null) {
        syndicateIds = ArraysUtil.difference(Object.keys(syndicates), Object.keys(lotteriesMap));
        syndicateIds.forEach(id => lotteriesMap[id] = syndicates[id]);
      }

      const drawsList: Array<DrawInterface> = data[2].filter(draw => ArraysUtil.inArray(Object.keys(lotteriesMap), draw.lottery_id));

      return this.getSortedLotteriesIds(lotteriesSortBy, lotteriesMap, drawsList).filter(id => !!id);
    });
  }

  getPopularUpcomingLotteryIds(mainJackpotLottery?, isFreeLinesOfferFirst = false): Observable<string[]> {
    return combineLatest(
      this.lotteriesService.getSoldLotteriesMap(),
      this.drawsService.getUpcomingDrawsMap(),
      this.offeringsService.getOffers(),
      this.lotteriesService.getPopularitylotteries(),
      this.syndicatesQueryService.getSyndicateModelsMap()
    )
      .map(data => {
        let lotteries: Array<string> = [];
        let lotteryIds = Object.keys(data[0]);
        const drawLotteryIds = Object.keys(data[1]);
        const offers = data[2];
        const popularUpcomingLotteries = data[3];
        const syndicates = data[4];
        let syndicateIds = [];

        if (typeof syndicates !== 'undefined' && syndicates !== null) {
          syndicateIds = ArraysUtil.difference(Object.keys(syndicates), lotteryIds);
          lotteryIds = [...lotteryIds, ...syndicateIds];
        }

        for (let i = 0; i < popularUpcomingLotteries.length; i++) {
          const id = Object.keys(offers)[i];
          if (id) {
            offers[id]['sortedIndex'] = popularUpcomingLotteries.indexOf(id);
          }
        }

        const diff = function (a, b) {
          return offers[a]['sortedIndex'] - offers[b]['sortedIndex'];
        };
        const offersSorted = Object.keys(offers).sort(diff);

        if (isFreeLinesOfferFirst) {
          lotteries = ArraysUtil.unique(offersSorted.concat(popularUpcomingLotteries));
        } else {
          lotteries = popularUpcomingLotteries;
        }

        return lotteries
          .filter((popularLotteryId: string) => ArraysUtil.inArray(lotteryIds, popularLotteryId))
          .filter((popularLotteryId: string) => ArraysUtil.inArray(drawLotteryIds, popularLotteryId))
          .filter((popularLotteryId: string) => popularLotteryId !== mainJackpotLottery);
      });
  }

  getOffersLotteryIds(): Observable<string[]> {
    return combineLatest(
      this.lotteriesService.getPopularitylotteries(),
      this.offeringsService.getFreeLinesOffersMap()
    ).map(([popularIds, freeLineOffersMap]: [string[], OfferingsFreeLinesOffersMapInterface]) => {

      for (let i = 0; i < popularIds.length; i++) {
        if (Object.keys(freeLineOffersMap)[i]) {
          Object.assign(freeLineOffersMap[Object.keys(freeLineOffersMap)[i]], {
            sortedIndex: popularIds.indexOf(Object.keys(freeLineOffersMap)[i])
          });
        }
      }

      const diff = function (a, b) {
        return freeLineOffersMap[a]['sortedIndex'] - freeLineOffersMap[b]['sortedIndex'];
      };
      return Object.keys(freeLineOffersMap).sort(diff);
    });
  }

  getCartOffersLotteryIds(minLotteryToKeep = 0): Observable<string[]> {
    return combineLatest(
      this.lotteriesService.getSoldLotteriesMap(),
      this.drawsService.getUpcomingDrawsMap(),
      this.lotteriesService.getPopularitylotteries(),
      this.cart2LotteryService.getLotteries$(),
      this.cart2SyndicateService.getSyndicates(),
      this.syndicatesQueryService.getSyndicateModelsMap()
    )
      .map(data => {
        const lotteryIds = [...Object.keys(data[0]), ...Object.keys(data[5])]
          .filter((el: string, index: number, array: string[]) => array.indexOf(el) === index);
        const drawLotteryIds = Object.keys(data[1]);
        let popularUpcomingLotteries = data[2];
        const alreadyInCartLotteries = data[3];
        const alreadyInCartSyndicates = data[4].map((syndicate: CartSyndicateItemModel) => syndicate.lotteryId);
        const minSize = popularUpcomingLotteries.length - alreadyInCartLotteries.length;
        const tempArr = [];

        popularUpcomingLotteries = popularUpcomingLotteries
          .filter((lotteryId: string) => ArraysUtil.inArray(lotteryIds, lotteryId))
          .filter((lotteryId: string) => ArraysUtil.inArray(drawLotteryIds, lotteryId));

        if (minSize < minLotteryToKeep + minSize) {
          for (let i = 0; i < minLotteryToKeep; i++) {
            tempArr.push(popularUpcomingLotteries[i]);
          }
          return popularUpcomingLotteries
            .filter((lotteryId: string) => !ArraysUtil.inArray(alreadyInCartLotteries, lotteryId))
            .filter((lotteryId: string) => !ArraysUtil.inArray(alreadyInCartSyndicates, lotteryId))
            .concat(tempArr);
        } else {
          return popularUpcomingLotteries
            .filter((lotteryId: string) => !ArraysUtil.inArray(alreadyInCartLotteries, lotteryId))
            .filter((lotteryId: string) => !ArraysUtil.inArray(alreadyInCartSyndicates, lotteryId));
        }
      });
  }

  getSyndicates$() {
    return combineLatest(
      this.syndicatesQueryService.getSyndicateModelsMap(),
      this.cart2SyndicateService.getSyndicates()
    ).map(data => {
      const items = data[0];
      const itemsIds = Object.keys(items);
      const alreadyInCartItems = data[1];
      const alreadyInCartIds = [];
      let difference = [];

      if (alreadyInCartItems.length !== 0) {
        alreadyInCartItems.forEach(item => {
          itemsIds.map(id => {
            if (items[id].templateId === item.templateId) {
              alreadyInCartIds.push(items[id].lotteryId);
            }
          });
        });
      }

      difference = ArraysUtil.difference(itemsIds, alreadyInCartIds);

      return difference.map(id => items[id]);
    });
  }

  getLotterySuperJackpot() {
    const brandId = this.brandQueryService.getBrandId();
    const euromillionsId = (brandId === 'BIGLOTTERYOWIN_UK') ? 'euromillions' : 'euromillions-ie';

    return this.getLotteriesIdsSortedList('upcoming', false, 'jackpot')
      .filter(ids => ids.length !== 0)
      .map(ids => ids[0])
      .switchMap(lotteryId => this.drawsService.getUpcomingDraw(lotteryId)
        .map(draw => draw.jackpot / 1000000 > 100 ? lotteryId : euromillionsId)
      );
  }
}
