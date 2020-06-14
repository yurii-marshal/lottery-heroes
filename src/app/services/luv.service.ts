import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { LuvSecureApiService } from './api/luv-secure.api.service';
import { LuvBrandInterface } from './api/entities/incoming/luv/luv-brands.interface';
import { LuvCurrencyInterface } from './api/entities/incoming/luv/luv-currencies.interface';
import {
  LuvCountriesBrandInterface, LuvCountriesInterface,
  LuvCountryInterface
} from './api/entities/incoming/luv/luv-countries.interface';
import { LuvDepositLimitInterface } from './api/entities/incoming/luv/luv-deposit-limit.interface';

import { ArraysUtil } from '../modules/shared/utils/arrays.util';
import { LuvCurrencyRateInterface } from './api/entities/incoming/luv/luv-currency-rates.interface';
import { PaymentSystemInterface } from './api/entities/incoming/wallet/payment-system.interface';
import { BrandParamsService } from '../modules/brand/services/brand-params.service';
import { LuvApiService } from '../modules/api/luv.api.service';

@Injectable()
export class LuvService {
  private countriesSubject$: BehaviorSubject<LuvCountryInterface[]>;
  private countriesLoaded = false;
  private countries$: Observable<LuvCountryInterface[]>;

  private countriesBrandSubject$: BehaviorSubject<LuvCountriesBrandInterface>;
  private countriesBrandLoaded = false;

  private brandsSubject$: BehaviorSubject<LuvBrandInterface[]>;
  private brandsLoaded = false;
  private brands$: Observable<LuvBrandInterface[]>;

  private currenciesSubject$: BehaviorSubject<LuvCurrencyInterface[]>;
  private currenciesLoaded = false;
  private currencies$: Observable<LuvCurrencyInterface[]>;

  private currencyRatesSubject$: BehaviorSubject<LuvCurrencyRateInterface[]>;
  private currencyRatesLoaded = false;
  private currencyRates$: Observable<LuvCurrencyRateInterface[]>;

  private depositLimitsSubject$: BehaviorSubject<LuvDepositLimitInterface[]>;

  static findCurrencySymbolInCurrencies(currencies: Array<LuvCurrencyInterface>, currencyId: string): string {
    const currency = ArraysUtil.findObjByKeyValue(currencies, 'id', currencyId);
    return currency ? (<LuvCurrencyInterface>currency).symbol : '';
  }

  static findCountryNameInCountries(countries: Array<LuvCountryInterface>, countryId: string): string {
    const country = ArraysUtil.findObjByKeyValue(countries, 'id', countryId);
    return country ? (<LuvCountryInterface>country).name : '';
  }

  constructor(private luvApiService: LuvApiService,
              private luvSecureApiService: LuvSecureApiService,
              private brandParamsService: BrandParamsService) {
    this.countriesSubject$ = new BehaviorSubject([]);
    this.countries$ = this.countriesSubject$.asObservable();

    this.countriesBrandSubject$ = new BehaviorSubject(null);

    this.brandsSubject$ = new BehaviorSubject([]);
    this.brands$ = this.brandsSubject$.asObservable();

    this.currenciesSubject$ = new BehaviorSubject([]);
    this.currencies$ = this.currenciesSubject$.asObservable();

    this.currencyRatesSubject$ = new BehaviorSubject(null);
    this.currencyRates$ = this.currencyRatesSubject$.asObservable();

    this.depositLimitsSubject$ = new BehaviorSubject(null);
  }

  loadCountries(ignoreCache = false): void {
    if (!this.countriesLoaded || ignoreCache) {
      this.countriesLoaded = true;

      this.luvApiService.getCountriesList()
        .subscribe((countries: Array<LuvCountryInterface>) => {
          this.countriesSubject$.next(countries);
        });
    }
  }

  loadCountriesBrand(ignoreCache = false): void {
    if (!this.countriesBrandLoaded || ignoreCache) {
      this.countriesBrandLoaded = true;

      this.luvApiService.getCountriesBrandList()
        .subscribe((countries: LuvCountriesInterface) => {
          this.countriesBrandSubject$.next(countries.countries);
        });
    }
  }

  loadBrands(ignoreCache = false): void {
    if (!this.brandsLoaded || ignoreCache) {
      this.brandsLoaded = true;

      this.luvApiService.getBrandsList()
        .subscribe((brands: Array<LuvBrandInterface>) => {
          this.brandsSubject$.next(brands);
        });
    }
  }

  loadCurrencies(ignoreCache = false): void {
    if (!this.currenciesLoaded || ignoreCache) {
      this.currenciesLoaded = true;

      this.luvApiService.getCurrenciesList()
        .subscribe((currencies: Array<LuvCurrencyInterface>) => {
          this.currenciesSubject$.next(currencies);
        });
    }
  }

  loadCurrencyRates(ignoreCache = false): void {
    if (!this.currencyRatesLoaded || ignoreCache) {
      this.currencyRatesLoaded = true;

      this.luvApiService.getCurrencyRates()
        .subscribe((currency_rates: Array<LuvCurrencyRateInterface>) => {
          this.currencyRatesSubject$.next(currency_rates);
        });
    }
  }

  loadDepositLimits() {
    const depositLimits = this.depositLimitsSubject$.getValue();
    if (depositLimits === null) {
      const brandId = this.brandParamsService.getBrandId();
      this.luvApiService.getDepositLimits(brandId).subscribe(
        limits => this.depositLimitsSubject$.next(limits)
      );
    }
  }

  getCountries(): Observable<LuvCountryInterface[]> {
    this.loadCountries();
    return this.countries$;
  }

  getCountriesBrand(): Observable<LuvCountryInterface[]> {
    this.loadCountriesBrand();
    const brandId = this.brandParamsService.getBrandId();
    return this.countriesBrandSubject$.asObservable()
      .map(cb => (cb && cb[brandId]) ? cb[brandId] : []);
  }

  getBrands(): Observable<LuvBrandInterface[]> {
    this.loadBrands();
    return this.brands$;
  }

  getCurrencies(): Observable<LuvCurrencyInterface[]> {
    this.loadCurrencies();
    return this.currencies$;
  }

  getCurrencyRates(): Observable<LuvCurrencyRateInterface[]> {
    this.loadCurrencyRates();
    return this.currencyRates$;
  }

  getPaymentSystems(): Observable<PaymentSystemInterface[]> {
    return this.luvSecureApiService.getPaymentSystems();
  }

  getDepositLimitsConfig(): Observable<LuvDepositLimitInterface[]> {
    this.loadDepositLimits();
    return this.depositLimitsSubject$.asObservable().filter(res => !!res);
  }
}
