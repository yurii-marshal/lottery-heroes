import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { LuvService } from '../../../../services/luv.service';
import { LuvCurrencyInterface } from '../../../../services/api/entities/incoming/luv/luv-currencies.interface';

@Injectable()
export class LuvCurrenciesResolver implements Resolve<LuvCurrencyInterface[]> {
  constructor(private luvService: LuvService) {
  }

  resolve(): Observable<LuvCurrencyInterface[]> {
    return this.luvService.getCurrencies()
      .filter((currencies: Array<LuvCurrencyInterface>) => currencies.length > 0)
      .first();
  }
}
