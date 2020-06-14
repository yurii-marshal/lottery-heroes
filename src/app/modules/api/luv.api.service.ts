import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BaseApiService } from './base.api.service';
import {
  LuvCountriesBrandInterface, LuvCountriesInterface,
  LuvCountryInterface
} from './entities/incoming/luv/luv-countries.interface';
import { LuvCurrenciesInterface, LuvCurrencyInterface } from './entities/incoming/luv/luv-currencies.interface';
import { LuvBrandsInterface, LuvBrandInterface } from './entities/incoming/luv/luv-brands.interface';
import { LuvSystemsInterface, LuvSystemInterface } from './entities/incoming/luv/luv-systems.interface';
import {
  LuvCustomerStatusesInterface, LuvCustomerStatusInterface
} from './entities/incoming/luv/luv-customer-statuses.interface';
import { LuvLoginTypesInterface, LuvLoginTypeInterface } from './entities/incoming/luv/luv-login-types.interface';
import {
  LuvDrawStatusesInterface,
  LuvDrawStatusInterface
} from './entities/incoming/luv/luv-draw-statuses.interface';
import {
  LuvLineStatusesInterface,
  LuvLineStatusInterface
} from './entities/incoming/luv/luv-line-statuses.interface';
import { LuvCurrencyRatesInterface, LuvCurrencyRateInterface } from './entities/incoming/luv/luv-currency-rates.interface';
import {
  LuvSubscriptionRenewPeriodInterface,
  LuvSubscriptionRenewPeriodsInterface
} from './entities/incoming/luv/luv-subscription-renew-periods.interface';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class LuvApiService {

  constructor(private baseApiService: BaseApiService) {}

  getCountriesList(): Observable<LuvCountryInterface[]> {
    return this.baseApiService.get('/luv/countries')
      .map((luv: LuvCountriesInterface) => luv.countries);
  }

  getCountriesBrandList(): Observable<LuvCountriesBrandInterface> {
    return this.baseApiService.get('/luv/brand/countries');
  }

  getCurrenciesList(): Observable<LuvCurrencyInterface[]> {
    return this.baseApiService.get('/luv/currencies')
      .map((luv: LuvCurrenciesInterface) => luv.currencies);
  }

  getBrandsList(): Observable<LuvBrandInterface[]> {
    return this.baseApiService.get('/luv/brands')
      .map((luv: LuvBrandsInterface) => luv.brands);
  }

  getSystemsList(): Observable<LuvSystemInterface[]> {
    return this.baseApiService.get('/luv/systems')
      .map((luv: LuvSystemsInterface) => luv.systems);
  }

  getCustomerStatusesList(): Observable<LuvCustomerStatusInterface[]> {
    return this.baseApiService.get('/luv/customer-statuses')
      .map((luv: LuvCustomerStatusesInterface) => luv.customer_statuses);
  }

  getLoginTypesList(): Observable<LuvLoginTypeInterface[]> {
    return this.baseApiService.get('/luv/login-types')
      .map((luv: LuvLoginTypesInterface) => luv.login_types);
  }

  getDrawStatusesList(): Observable<LuvDrawStatusInterface[]> {
    return this.baseApiService.get('/luv/draw-statuses')
      .map((luv: LuvDrawStatusesInterface) => luv.draw_statuses);
  }

  getLineStatusesList(): Observable<LuvLineStatusInterface[]> {
    return this.baseApiService.get('/luv/line-statuses')
      .map((luv: LuvLineStatusesInterface) => luv.line_statuses);
  }

  getCurrencyRates(): Observable<LuvCurrencyRateInterface[]> {
    return this.baseApiService.get('/luv/currency-rates')
      .map((luv: LuvCurrencyRatesInterface) => luv.currency_rates);
  }

  getDepositLimits(brandId: string): Observable<any> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('brand_id', brandId);

    return this.baseApiService.get('/luv/brand/deposit-limits', httpParams)
      .map(limits => limits['deposit_limits'][brandId]);
  }

  getSubscriptionRenewPeriods(brandId: string): Observable<LuvSubscriptionRenewPeriodInterface[]> {
    return this.baseApiService.get('/luv/brand/subscription-renew-periods')
      .map((luv: LuvSubscriptionRenewPeriodsInterface) => luv.subscription_renew_periods[brandId]);
  }
}
