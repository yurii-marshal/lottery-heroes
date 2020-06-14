import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { BaseApiQueryService } from './base-api-query.service';
import { GetLotteriesDto, LotteryDto } from '../../dto/lotteries/get-lotteries.dto';
import { DrawDto } from '../../dto/lotteries/draw.dto';
import { GetDrawsDto } from '../../dto/lotteries/get-draws.dto';
import { SingleDrawDto } from '../../dto/lotteries/single-draw.dto';

interface GetDrawsParamsInterface {
  currencyId: string;
  upcoming?: boolean;
  latest?: boolean;
}

@Injectable()
export class LotteriesApiQueryService {
  constructor(private baseApiQueryService: BaseApiQueryService) {
  }

  getLotteries(brandId: string): Observable<LotteryDto[]> {
    const httpParams = new HttpParams().set('brand_id', brandId);

    return this.baseApiQueryService.get('/lotteries', httpParams)
      .pipe(
        map((response: GetLotteriesDto) => response.lotteries)
      );
  }

  getDraws(params: GetDrawsParamsInterface): Observable<DrawDto[]> {
    let httpParams = new HttpParams()
      .set('currency-id', params.currencyId);

    if (params.upcoming === true && params.latest === true) {
      throw new Error('Upcoming and latest must not be set together.');
    } else if (params.upcoming !== true && params.latest !== true) {
      throw new Error('Upcoming or latest must be set.');
    } else if (params.upcoming === true) {
      httpParams = httpParams.set('upcoming', 'true');
    } else if (params.latest === true) {
      httpParams = httpParams.set('latest', 'true');
    }

    return this.baseApiQueryService.get('/lotteries/draws', httpParams)
      .pipe(
        map((response: GetDrawsDto) => response.draws)
      );
  }

  getDrawsById(drawIds: number[], currencyId: string): Observable<DrawDto[]> {
    const httpParams = new HttpParams()
      .set('status-id', 'open,settled,closed,reported,cancelled')
      .set('currency-id', currencyId)
      .set('draw-id', drawIds.join());

    return this.baseApiQueryService.get('/lotteries/draws', httpParams)
      .pipe(
        map((response: GetDrawsDto) => response.draws)
      );
  }

  /**
   * @param {string} lotteryId
   * @param {string} dateLocal in format 'YYYY-MM-DD'
   * @returns {Observable<SingleDrawDto>}
   */
  getDrawByDateLocal(lotteryId: string, dateLocal: string): Observable<SingleDrawDto> {
    return this.baseApiQueryService.get(`/lotteries/${lotteryId}/${dateLocal}`);
  }
}
