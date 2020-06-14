import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { OfferingsService } from '../../../../services/offerings/offerings.service';
import { OfferingsPricesMapInterface } from '../../../../services/api/entities/incoming/offerings/offerings-prices.interface';

@Injectable()
export class OfferingsPricesResolver implements Resolve<OfferingsPricesMapInterface> {
  constructor(private offeringsService: OfferingsService) {
  }

  resolve(): Observable<OfferingsPricesMapInterface> {
    return this.offeringsService.getPrices().first();
  }
}
