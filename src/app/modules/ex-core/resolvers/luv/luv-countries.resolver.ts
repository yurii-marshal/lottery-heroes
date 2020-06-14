import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { LuvService } from '../../../../services/luv.service';
import { LuvCountryInterface } from '../../../../services/api/entities/incoming/luv/luv-countries.interface';

@Injectable()
export class LuvCountriesResolver implements Resolve<LuvCountryInterface[]> {
  constructor(private luvService: LuvService) {
  }

  resolve(): Observable<LuvCountryInterface[]> {
    return this.luvService.getCountries()
      .filter((countries: Array<LuvCountryInterface>) => countries.length > 0)
      .first();
  }
}
