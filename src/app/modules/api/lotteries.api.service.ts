import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BaseApiService } from './base.api.service';
import { LotteryInterface, LotteriesInterface } from './entities/incoming/lotteries/lotteries.interface';
import { DrawInterface, DrawsInterface } from './entities/incoming/lotteries/draws.interface';
import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs/observable/of';

export interface GetLotteriesListParamsInterface {
  brandId: string;
  countryId?: string;
}

export interface GetDrawsListParamsInterface {
  upcoming?: boolean;
  latest?: boolean;
  drawsIds?: Array<number>;
  lotteriesIds?: Array<string>;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  currencyId?: string;
}

@Injectable()
export class LotteriesApiService {
  constructor(private baseApiService: BaseApiService) {
  }

  getLotteriesList(params: GetLotteriesListParamsInterface): Observable<LotteryInterface[]> {
    let httpParams = new HttpParams();

    httpParams = httpParams.set('brand_id', params.brandId);

    if (params.countryId) {
      httpParams = httpParams.set('country_id', params.countryId);
    }

    return this.baseApiService.get('/lotteries', httpParams)
      .map((result: LotteriesInterface) => result.lotteries);
  }

  getDrawsList(params: GetDrawsListParamsInterface): Observable<DrawInterface[]> {
    let httpParams = new HttpParams();

    if (params.upcoming === true) {
      httpParams = httpParams.set('upcoming', 'true');
    }

    if (params.latest === true) {
      httpParams = httpParams.set('latest', 'true');
    }

    if (params.drawsIds) {
      httpParams = httpParams.set('draw-id', params.drawsIds.join());
    }

    if (params.lotteriesIds) {
      httpParams = httpParams.set('lottery', params.lotteriesIds.join());
    }

    if (params.startDate) {
      httpParams = httpParams.set('start-date', params.startDate.toISOString());
    }

    if (params.endDate) {
      httpParams = httpParams.set('end-date', params.endDate.toISOString());
    }

    if (params.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }

    if (params.currencyId) {
      httpParams = httpParams.set('currency-id', params.currencyId);
    }

    return this.baseApiService.get('/lotteries/draws', httpParams)
      .map((result: DrawsInterface) => result.draws);
  }

  getDraw(drawId: number): Observable<DrawInterface> {
    return this.baseApiService.get('/lotteries/draws/' + drawId)
      .catch(() => of(null));
  }

  /**
   * @param lotteryId
   * @param dateLocal in format 'YYYY-MM-DD'
   * @returns {Observable<DrawInterface>}
   */
  getDrawByDate(lotteryId: string, dateLocal: string): Observable<DrawInterface> {
    return this.baseApiService.get('/lotteries/' + lotteryId + '/' + dateLocal)
      .catch(() => of(null));
  }
}
