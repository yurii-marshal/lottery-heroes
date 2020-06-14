import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LuvBrandInterface } from '../api/entities/incoming/luv/luv-brands.interface';
import { ArraysUtil } from '../../modules/shared/utils/arrays.util';
import { LuvCurrencyInterface } from '../api/entities/incoming/luv/luv-currencies.interface';
import { LuvService } from '../luv.service';
import { BrandParamsService } from '../../modules/brand/services/brand-params.service';

@Injectable()
export class CurrencyService {

  constructor(private luvService: LuvService,
              private brandParamsService: BrandParamsService) { }

  getCurrencyId(): Observable<string> {
    return this.luvService.getBrands()
      .filter(brands => brands.length > 0)
      .first()
      .map((brands: Array<LuvBrandInterface>) => {
        const siteBrandId: string = this.brandParamsService.getBrandId();
        const siteBrand: LuvBrandInterface = ArraysUtil.findObjByKeyValue(brands, 'id', siteBrandId);
        return siteBrand ? siteBrand.currency_id : '';
      });
  }

  getCurrencySymbol(): Observable<string> {
    return this.getCurrencyId()
      .switchMap((currencyId: string) => this.luvService.getCurrencies()
        .map((currencies: Array<LuvCurrencyInterface>) => LuvService.findCurrencySymbolInCurrencies(currencies, currencyId)));
  }

}
