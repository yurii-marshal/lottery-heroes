import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {BrandParamsService} from '../../modules/brand/services/brand-params.service';
import {DrawsService} from '../lotteries/draws.service';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {LotteriesService} from '../lotteries/lotteries.service';
import {LotteriesMapInterface} from '../lotteries/entities/interfaces/lotteries-map.interface';
import {DrawsMapInterface} from '../lotteries/entities/interfaces/draws-map.interface';
import {MemoryCacheService} from '../cache/memory-cache.service';
import {environment} from '../../../environments/environment';
import {OfferingsApiService} from '../../modules/api/offerings.api.service';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {SyndicateModel} from '@libs/biglotteryowin-core/models/syndicate.model';
import {SyndicatesQueryService} from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';
import {BundleItemModelMap} from './entities/bundles-map.interface';
import {BundleItemModel} from '../../models/bundle.model';
import {OfferingsBundleInterface} from '../../modules/api/entities/incoming/offerings/offerings-bundles.interface';
import {OfferingsBundlePriorityInterface} from '../../modules/api/entities/incoming/offerings/offerings-bundles-priorities.interface';

@Injectable()
export class BundlesService {
  private brandId: string;

  private activeBundlesRawSubject$: ReplaySubject<OfferingsBundleInterface[]> = new ReplaySubject(1);
  private activeBundlesListSubject$: ReplaySubject<BundleItemModel[]> = new ReplaySubject(1);
  private activeBundlesMapSubject$: ReplaySubject<BundleItemModelMap> = new ReplaySubject(1);

  private bundleLogoDomain: string;

  constructor(private offeringsApiService: OfferingsApiService,
              private brandParamsService: BrandParamsService,
              private drawsService: DrawsService,
              private lotteriesService: LotteriesService,
              private memoryCacheService: MemoryCacheService,
              private syndicatesQueryService: SyndicatesQueryService) {
    this.brandId = this.brandParamsService.getBrandId();
    this.bundleLogoDomain = environment.bundleLogoUrl;

    combineLatest(
      this.activeBundlesRawSubject$,
      this.lotteriesService.getSoldLotteriesMap(),
      this.drawsService.getUpcomingDrawsMap(),
      this.syndicatesQueryService.getSyndicateModelsMap()
    )
      .map(([bundles, lotteriesMap, upcomingDrawsMap, syndicatesMap]: [
        OfferingsBundleInterface[],
        LotteriesMapInterface,
        DrawsMapInterface,
        { [lotteryId: string]: SyndicateModel }]) => {
        return bundles.map(bundle => this.bundleFabric(bundle, lotteriesMap, upcomingDrawsMap, syndicatesMap));
      })
      .subscribe((bundlesList: Array<BundleItemModel>) => this.activeBundlesListSubject$.next(bundlesList));

    this.activeBundlesListSubject$
      .map(this.convertBundlesListToMap)
      .subscribe((bundlesMap: BundleItemModelMap) => this.activeBundlesMapSubject$.next(bundlesMap));

    this.loadActiveBundles();
  }

  private loadActiveBundles(): void {
    this.offeringsApiService.getBundles(this.brandId, ['active'])
      .subscribe((bundles: Array<OfferingsBundleInterface>) => this.activeBundlesRawSubject$.next(bundles));
  }

  getActiveBundlesMap(): Observable<BundleItemModelMap> {
    return this.activeBundlesMapSubject$.asObservable();
  }

  // bundles sorted by priority then by jackpot
  getSortedByPriorityDisplayedBundlesList(page: string): Observable<BundleItemModel[]> {
    const requestPriorities$ = this.offeringsApiService.getBundlesPriorities(this.brandId, page);

    if (!this.memoryCacheService.hasData('getSortedByPriorityActiveBundlesList' + page)) {
      this.memoryCacheService.setData('getSortedByPriorityActiveBundlesList' + page, requestPriorities$);
    }

    const priorities$ = this.memoryCacheService.getData('getSortedByPriorityActiveBundlesList' + page);

    return combineLatest(
      this.activeBundlesListSubject$,
      priorities$,
      (bundlesList: Array<BundleItemModel>, priorities: Array<OfferingsBundlePriorityInterface>) => {
        return bundlesList.map(bundle => {
          const priority: OfferingsBundlePriorityInterface | undefined = priorities.find(value => value.bundle_id === bundle.id);
          bundle.priorityOrder = (typeof priority !== 'undefined') ? priority.priority : 1000;
          return bundle;
        });
      }
    )
      .map(bundlesList => {
        return bundlesList
          .filter((bundle) => bundle.is_displayed === true)
          .sort((bundleA, bundleB) => {
            let result = 0;

            if (bundleA.priorityOrder !== bundleB.priorityOrder &&
              typeof bundleA.priorityOrder !== 'undefined' && typeof bundleB.priorityOrder !== 'undefined') {
              result = Number(bundleA.priorityOrder) - Number(bundleB.priorityOrder);
            } else {
              result = bundleB.jackpotTotal - bundleA.jackpotTotal;
            }

            return result;
          });
      });
  }

  getSortedByJackpotDisplayedBundlesList(): Observable<BundleItemModel[]> {
    return this.activeBundlesListSubject$
      .map(bundlesList => {
        return bundlesList
          .filter((bundle) => bundle.is_displayed === true)
          .sort((bundleA, bundleB) => bundleB.jackpotTotal - bundleA.jackpotTotal);
      });
  }

  private bundleFabric(bundle: OfferingsBundleInterface,
                       lotteriesMap: LotteriesMapInterface,
                       upcomingDrawsMap: DrawsMapInterface,
                       syndicatesMap: { [lotteryId: string]: SyndicateModel }): BundleItemModel {
    return new BundleItemModel(
      bundle.id,
      bundle.name,
      bundle.status_id,
      bundle.is_displayed,
      bundle.draws_options,
      bundle.logo_path,
      bundle.items,
      bundle.prices,
      this.bundleLogoDomain,
      lotteriesMap,
      upcomingDrawsMap,
      syndicatesMap);
  }

  private convertBundlesListToMap(list: Array<BundleItemModel>): BundleItemModelMap {
    return list.reduce((resultMap: BundleItemModelMap, bundle: BundleItemModel) => {
      return Object.assign(resultMap, {
        [bundle.id]: bundle
      });
    }, {});
  }
}
