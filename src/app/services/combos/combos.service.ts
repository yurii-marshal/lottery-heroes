import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BrandParamsService } from '../../modules/brand/services/brand-params.service';
import { ComboItemModel } from '../../models/combo.model';
import { DrawsService } from '../lotteries/draws.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { LotteriesService } from '../lotteries/lotteries.service';
import { ComboItemModelMap } from './entities/combos-map.interface';
import { LotteriesMapInterface } from '../lotteries/entities/interfaces/lotteries-map.interface';
import { DrawsMapInterface } from '../lotteries/entities/interfaces/draws-map.interface';
import { MemoryCacheService } from '../cache/memory-cache.service';
import { environment } from '../../../environments/environment';
import { OfferingsComboInterface } from '../../modules/api/entities/incoming/offerings/offerings-combos.interface';
import { OfferingsApiService } from '../../modules/api/offerings.api.service';
import { OfferingsComboPriorityInterface } from '../../modules/api/entities/incoming/offerings/offerings-combos-priorities.interface';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';

@Injectable()
export class CombosService {
  private brandId: string;

  private activeCombosRawSubject$: ReplaySubject<OfferingsComboInterface[]> = new ReplaySubject(1);
  private activeCombosListSubject$: ReplaySubject<ComboItemModel[]> = new ReplaySubject(1);
  private activeCombosMapSubject$: ReplaySubject<ComboItemModelMap> = new ReplaySubject(1);

  private comboLogoDomain: string;

  constructor(private offeringsApiService: OfferingsApiService,
              private brandParamsService: BrandParamsService,
              private drawsService: DrawsService,
              private lotteriesService: LotteriesService,
              private memoryCacheService: MemoryCacheService,
              private syndicatesQueryService: SyndicatesQueryService) {
    this.brandId = this.brandParamsService.getBrandId();
    this.comboLogoDomain = environment.comboLogoUrl;

    combineLatest(
      this.activeCombosRawSubject$,
      this.lotteriesService.getSoldLotteriesMap(),
      this.drawsService.getUpcomingDrawsMap(),
      this.syndicatesQueryService.getSyndicateModelsMap()
    )
      .map(([combos, lotteriesMap, upcomingDrawsMap, syndicatesMap]: [
        OfferingsComboInterface[],
        LotteriesMapInterface,
        DrawsMapInterface,
        { [lotteryId: string]: SyndicateModel }]) => {
        return combos.map(combo => this.comboFabric(combo, lotteriesMap, upcomingDrawsMap, syndicatesMap));
      })
      .subscribe((combosList: Array<ComboItemModel>) => this.activeCombosListSubject$.next(combosList));

    this.activeCombosListSubject$
      .map(this.convertCombosListToMap)
      .subscribe((combosMap: ComboItemModelMap) => this.activeCombosMapSubject$.next(combosMap));

    this.loadActiveCombos();
  }

  private loadActiveCombos(): void {
    this.offeringsApiService.getCombos(this.brandId, ['active'])
      .subscribe((combos: Array<OfferingsComboInterface>) => this.activeCombosRawSubject$.next(combos));
  }

  getActiveCombosMap(): Observable<ComboItemModelMap> {
    return this.activeCombosMapSubject$.asObservable();
  }

  // combos sorted by priority then by jackpot
  getSortedByPriorityDisplayedCombosList(page: string): Observable<ComboItemModel[]> {
    const requestPriorities$ = this.offeringsApiService.getCombosPriorities(this.brandId, page);

    if (!this.memoryCacheService.hasData('getSortedByPriorityActiveCombosList' + page)) {
      this.memoryCacheService.setData('getSortedByPriorityActiveCombosList' + page, requestPriorities$);
    }

    const priorities$ = this.memoryCacheService.getData('getSortedByPriorityActiveCombosList' + page);

    return combineLatest(
      this.activeCombosListSubject$,
      priorities$,
      (combosList: Array<ComboItemModel>, priorities: Array<OfferingsComboPriorityInterface>) => {
        return combosList.map(combo => {
          const priority: OfferingsComboPriorityInterface | undefined = priorities.find(value => value.combo_id === combo.id);
          combo.priorityOrder = (typeof priority !== 'undefined') ? priority.priority : 1000;
          return combo;
        });
      }
    )
      .map(combosList => {
        return combosList
          .filter((combo) => combo.is_displayed === true)
          .sort((comboA, comboB) => {
            let result = 0;

            if (comboA.priorityOrder !== comboB.priorityOrder &&
              typeof comboA.priorityOrder !== 'undefined' && typeof comboB.priorityOrder !== 'undefined') {
              result = Number(comboA.priorityOrder) - Number(comboB.priorityOrder);
            } else {
              result = comboB.jackpotTotal - comboA.jackpotTotal;
            }

            return result;
          });
      });
  }

  getSortedByJackpotDisplayedCombosList(): Observable<ComboItemModel[]> {
    return this.activeCombosListSubject$
      .map(combosList => {
        return combosList
          .filter((combo) => combo.is_displayed === true)
          .sort((comboA, comboB) => comboB.jackpotTotal - comboA.jackpotTotal);
      });
  }

  private comboFabric(combo: OfferingsComboInterface,
                      lotteriesMap: LotteriesMapInterface,
                      upcomingDrawsMap: DrawsMapInterface,
                      syndicatesMap: { [lotteryId: string]: SyndicateModel }): ComboItemModel {
    return new ComboItemModel(
      combo.id,
      combo.name,
      combo.status_id,
      combo.is_displayed,
      combo.draws_options,
      combo.logo_path,
      combo.items,
      combo.prices,
      this.comboLogoDomain,
      lotteriesMap,
      upcomingDrawsMap,
      syndicatesMap);
  }

  private convertCombosListToMap(list: Array<ComboItemModel>): ComboItemModelMap {
    return list.reduce((resultMap: ComboItemModelMap, combo: ComboItemModel) => {
      return Object.assign(resultMap, {
        [combo.id]: combo
      });
    }, {});
  }
}
