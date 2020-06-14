import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { OfferingsService } from '../../../../services/offerings/offerings.service';
import { OfferingsCombosMapInterface } from '../../../../services/offerings/entities/offerings-combos-map.interface';

@Injectable()
export class OfferingsCombosResolver implements Resolve<OfferingsCombosMapInterface> {
  constructor(private offeringsService: OfferingsService) {
  }

  resolve(): Observable<OfferingsCombosMapInterface> {
    return this.offeringsService.getActiveCombosMap().first();
  }
}
