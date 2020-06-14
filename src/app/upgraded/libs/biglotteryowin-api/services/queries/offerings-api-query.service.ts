import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { BaseApiQueryService } from './base-api-query.service';
import { GetSyndicatesDto, SyndicateDto } from '../../dto/offerings/get-syndicates.dto';
import { GetOffersDto, OffersMapDto } from '../../dto/offerings/get-offers.dto';
import { GetPricesDto, PricesMapDto } from '../../dto/offerings/get-prices.dto';

@Injectable()
export class OfferingsApiQueryService {
  constructor(private baseApiQueryService: BaseApiQueryService) {
  }

  getSyndicates(brandId: string): Observable<SyndicateDto[]> {
    return this.baseApiQueryService.get(`/offerings/syndicates/${brandId}`)
      .pipe(
        map((response: GetSyndicatesDto) => response.syndicates)
      );
  }

  getPrices(brandId: string): Observable<PricesMapDto> {
    return this.baseApiQueryService.get(`/offerings/prices/${brandId}`)
      .pipe(
        map((response: GetPricesDto) => response.prices)
      );
  }

  getOffers(brandId: string): Observable<OffersMapDto> {
    return this.baseApiQueryService.get(`/offerings/offers/${brandId}`)
      .pipe(
        map((response: GetOffersDto) => response.offers)
      );
  }
}
