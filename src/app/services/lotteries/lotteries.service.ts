import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { BrandParamsService } from '../../modules/brand/services/brand-params.service';

import { LotteriesMapInterface } from './entities/interfaces/lotteries-map.interface';
import { ArraysUtil } from '../../modules/shared/utils/arrays.util';
import { ObjectsUtil } from '../../modules/shared/utils/objects.util';
import { NumbersUtil } from '../../modules/shared/utils/numbers.util';

import { LotteriesApiService } from '../../modules/api/lotteries.api.service';
import {
  LotteriesPopularityInterface,
  LotteryBrandInterface,
  LotteryInterface,
  LotteryOddsRankAssoc,
  LotteryRulesInterface,
  LotteryStatsInterface
} from '../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { map, tap } from 'rxjs/operators';
import {
  BallCombinationsMapInterface,
  ParsedBallCombinationInterface
} from '../api/entities/incoming/lotteries/ball-combinations-map.interface';
import { SlugsMapInterface } from './entities/interfaces/slugs-map.interface';
import { BrandQueryService } from '@libs/biglotteryowin-core/services/queries/brand-query.service';
import { SegmentationIdsInterface } from './entities/interfaces/segmentation.interface';

@Injectable()
export class LotteriesService {
  private lotteriesMapSubject$: BehaviorSubject<LotteriesMapInterface>;
  private lotteriesPopularitySubject$: BehaviorSubject<LotteriesPopularityInterface[]>;
  private brandId: string;

  private static convertLotteriesListToMap(list: Array<LotteryInterface>): LotteriesMapInterface {
    return list.reduce((resultMap: LotteriesMapInterface, lottery: LotteryInterface) => {
      return Object.assign(resultMap, {
        [lottery.id]: lottery
      });
    }, {});
  }

  constructor(private brandParamsService: BrandParamsService,
              private lotteriesApiService: LotteriesApiService,
              private brandQueryService: BrandQueryService) {
    this.lotteriesMapSubject$ = new BehaviorSubject({});
    this.lotteriesPopularitySubject$ = new BehaviorSubject(null);
    this.brandId = this.brandParamsService.getBrandId();
    this.loadLotteriesMap();
  }

  hasSoldBrand(brands: Array<LotteryBrandInterface>): boolean {
    const brandProperties: LotteryBrandInterface = ArraysUtil.findObjByKeyValue(brands, 'id', this.brandId);
    return brandProperties ? brandProperties.is_sold : false;
  }

  loadLotteriesMap(): void {
    this.lotteriesApiService.getLotteriesList({brandId: this.brandId})
      .map((lotteriesList: Array<LotteryInterface>) => {
        return (this.brandId === 'BIGLOTTERYOWIN_UK') ? lotteriesList.filter(lottery => lottery.id !== 'euromillions-ie') : lotteriesList;
      })
      .do((lotteriesList: Array<LotteryInterface>) => this.setPopularityList(lotteriesList))
      .map((lotteriesList: Array<LotteryInterface>) => this.changeLogoPaths(lotteriesList))
      .map((lotteriesList: Array<LotteryInterface>) => LotteriesService.convertLotteriesListToMap(lotteriesList))
      .subscribe((lotteriesMap: LotteriesMapInterface) => {
        this.lotteriesMapSubject$.next(lotteriesMap);
      });
  }

  private setPopularityList(lotteries: Array<LotteryInterface>) {
    let popularityList: LotteriesPopularityInterface[] = [];
    lotteries.map(lottery => {
      lottery.brands
        .filter(brand => brand.id === this.brandId)
        .map(brand => popularityList.push({id: lottery.id, popularity: brand.popularity}));
    });
    popularityList = popularityList.sort((a, b) => a.popularity - b.popularity);
    this.lotteriesPopularitySubject$.next(popularityList);
    return lotteries;
  }

  getPopularitylotteries(): Observable<string[]> {
    return this.lotteriesPopularitySubject$
      .asObservable()
      .filter(lotteries => lotteries !== null)
      .map(lotteries => lotteries.map(lottery => lottery.id));
  }

  getLotteriesMap(): Observable<LotteriesMapInterface> {
    return this.lotteriesMapSubject$.asObservable()
    // TODO_OY: Hardcoded value
      .pipe(
        tap((lotteries: LotteriesMapInterface) => {
          Object.keys(lotteries).forEach((key: string) => {
            if (lotteries[key].rules.min_lines < 2) {
              lotteries[key].rules.min_lines = 2;
            }
          });
        })
      );
  }

  getSoldLotteriesMap(): Observable<LotteriesMapInterface> {
    return this.getLotteriesMap()
      .map((lotteriesMap: LotteriesMapInterface) => {
        // Filter lotteries by is_sold property
        const allowedLotteriesMap = ObjectsUtil.deepClone(lotteriesMap);
        Object.keys(allowedLotteriesMap).map((lotteryId: string) => {
          if (!this.hasSoldBrand(allowedLotteriesMap[lotteryId].brands)) {
            delete allowedLotteriesMap[lotteryId];
          }
        });

        return allowedLotteriesMap;
      })
      .filter(data => !ObjectsUtil.isEmptyObject(data));
  }

  getLottery(lotteryId: string, allLotteries = true): Observable<LotteryInterface | undefined> {
    const lotteriesMap$ = allLotteries ? this.getLotteriesMap() : this.getSoldLotteriesMap();
    return lotteriesMap$
      .filter((lotteriesMap: LotteriesMapInterface) => !ObjectsUtil.isEmptyObject(lotteriesMap))
      .map((lotteriesMap: LotteriesMapInterface) => lotteriesMap[lotteryId]);
  }

  getLotteryRules(lotteryId: string, allLotteries = true): Observable<LotteryRulesInterface> {
    return this.getLottery(lotteryId, allLotteries)
      .map((lottery: LotteryInterface) => lottery.rules);
  }

  getLotteryStats(lotteryId: string, allLotteries = true): Observable<LotteryStatsInterface> {
    return this.getLottery(lotteryId, allLotteries)
      .filter((lottery: LotteryInterface) => !!lottery)
      .map((lottery: LotteryInterface) => lottery.stats)
      .map((lotteryStats: LotteryStatsInterface) => {
        lotteryStats.hot_numbers.sort(NumbersUtil.sortNumbersAscFunction);
        lotteryStats.cold_numbers.sort(NumbersUtil.sortNumbersAscFunction);
        return lotteryStats;
      });
  }

  getSlugsMap(): Observable<SlugsMapInterface> {
    return this.lotteriesMapSubject$.asObservable()
      .pipe(
        map((lotteriesMap: LotteriesMapInterface) => Object.keys(lotteriesMap).map((key: string) => lotteriesMap[key])),
        map((lotteriesList: LotteryInterface[]) => {
          return lotteriesList.reduce((slugsMap: { [p: string]: string }, lottery: LotteryInterface) => {
            const brand: LotteryBrandInterface = lottery.brands.find((_brand: LotteryBrandInterface) => _brand.id === this.brandId);

            if (brand) {
              slugsMap[lottery.id] = brand.url_slug;
            }

            return slugsMap;
          }, {});
        })
      );
  }

  getSlug(lotteryId: string): Observable<string> {
    return this.getSlugsMap()
      .pipe(
        map((slugsMap: SlugsMapInterface) => slugsMap[lotteryId])
      );
  }

  getSlugByLottery(lottery: LotteryInterface): string {
    const brand: LotteryBrandInterface = lottery.brands.find((_brand: LotteryBrandInterface) => {
      return _brand.id === this.brandQueryService.getBrandId();
    });

    return brand ? brand.url_slug : '';
  }

  getSegmentationIdsMap(): Observable<SegmentationIdsInterface> {
    return this.lotteriesMapSubject$.asObservable()
      .pipe(
        map((lotteriesMap: LotteriesMapInterface) => Object.keys(lotteriesMap).map((key: string) => lotteriesMap[key])),
        map((lotteriesList: LotteryInterface[]) => {
          return lotteriesList.reduce((segmentationIdsMap: SegmentationIdsInterface, lottery: LotteryInterface) => {
            const brand: LotteryBrandInterface = lottery.brands.find((_brand: LotteryBrandInterface) => _brand.id === this.brandId);

            if (brand) {
              segmentationIdsMap[brand.lotid] = lottery.id;
            }

            return segmentationIdsMap;
          }, {});
        })
      );
  }

  private changeLogoPaths(lotteriesList: Array<LotteryInterface>): Array<LotteryInterface> {
    return lotteriesList.map((lottery: LotteryInterface) => {

      const hostName = this.brandParamsService.getURL();

      lottery.logo = hostName + '/assets/images/lottery-logos/' + lottery.id + '.svg';
      lottery.logo_wide = hostName + '/assets/images/lottery-logos/lottery-logos-line/' + lottery.id + '.svg';

      return lottery;
    });
  }

  parseBallCombinationsMap(oddsObj: BallCombinationsMapInterface,
                           sortBy: 'valAsc' | 'valDesc' | 'balls',
                           rankAssocObj: LotteryOddsRankAssoc = null): Array<ParsedBallCombinationInterface> {
    const result = [];

    if (!oddsObj) {
      return result;
    } else {
      oddsObj = ObjectsUtil.deepClone(oddsObj);
    }

    Object.keys(oddsObj).map((key: string) => {

      const val = typeof oddsObj[key] === 'number'
        ? oddsObj[key] : parseFloat(<string>oddsObj[key]);
      let finalObj: object;

      if (rankAssocObj !== null) {
        const assoc = [];
        finalObj = {key, val, assoc};

        Object.keys(rankAssocObj).map(rankAssocObjKey => {

          if (rankAssocObjKey !== key) {
            return;
          }

          rankAssocObj[rankAssocObjKey].forEach((rankAssocObjValue) => {
            const parsedRankAssocObj = {};

            rankAssocObjValue.split('_').forEach((rankAssocObjKeyPart) => {
              parsedRankAssocObj[rankAssocObjKeyPart.charAt(0)] = parseInt(rankAssocObjKeyPart.charAt(1), 10);
            });

            assoc.push(parsedRankAssocObj);
          });
        });

      } else {
        finalObj = {key, val};
      }

      key.split('_').forEach((oddsObjKeyPart: string) => {
        finalObj[oddsObjKeyPart.charAt(0)] = parseInt(oddsObjKeyPart.charAt(1), 10);
      });

      result.push(finalObj);
    });

    this.sortOdds(sortBy, result);

    return result;
  }

  private sortOdds(sortBy: string, result: Array<ParsedBallCombinationInterface>): void {
    switch (sortBy) {
      case 'valAsc':
        result = result.sort((itemA: ParsedBallCombinationInterface, itemB: ParsedBallCombinationInterface) => itemA.val - itemB.val);
        break;
      case 'valDesc':
        result = result.sort((itemA: ParsedBallCombinationInterface, itemB: ParsedBallCombinationInterface) => itemB.val - itemA.val);
        break;
      case 'balls':
        result = result.sort((itemA: ParsedBallCombinationInterface, itemB: ParsedBallCombinationInterface) => {
          if (itemA['m'] < itemB['m']) {
            return 1;
          } else if (itemA['m'] > itemB['m']) {
            return -1;
          } else {
            if (itemA['x'] && !itemB['x']) {
              return -1;
            } else if (!itemA['x'] && itemB['x']) {
              return 1;
            } else if (itemA['x'] > itemB['x']) {
              return -1;
            } else if (itemA['x'] < itemB['x']) {
              return 1;
            } else {
              return 0;
            }
          }
        });
        break;
    }
  }

}
