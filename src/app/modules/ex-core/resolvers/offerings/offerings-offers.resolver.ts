import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { OfferingsService } from '../../../../services/offerings/offerings.service';
import { OfferingsOffersMapInterface } from '../../../api/entities/incoming/offerings/offerings-offers.interface';

@Injectable()
export class OfferingsOffersResolver implements Resolve<OfferingsOffersMapInterface> {
  constructor(private offeringsService: OfferingsService) {
  }

  resolve(): Observable<OfferingsOffersMapInterface> {
    return this.offeringsService.getOffers().first();
  }
}
