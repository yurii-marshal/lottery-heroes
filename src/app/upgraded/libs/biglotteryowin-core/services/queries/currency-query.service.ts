import { Injectable } from '@angular/core';

import { BrandQueryService } from './brand-query.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CurrencyQueryService {
  constructor(private brandQueryService: BrandQueryService) {
  }

  getSiteCurrencyId(): Observable<string> {
    return this.brandQueryService.getBrandCurrencyId();
  }
}
