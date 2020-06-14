import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { OfferingsService } from '../../../../services/offerings/offerings.service';
import {OfferingsBundlesMapInterface} from '../../../../services/offerings/entities/offerings-bundles-map.interface';

@Injectable()
export class OfferingsBundlesResolver implements Resolve<OfferingsBundlesMapInterface> {
  constructor(private offeringsService: OfferingsService) {
  }

  resolve(): Observable<OfferingsBundlesMapInterface> {
    return this.offeringsService.getActiveCombosMap().first();
  }
}
