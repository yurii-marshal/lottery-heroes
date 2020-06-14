import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { getBrandId, getApiUrl, getSiteUrl } from 'package-brands';
import { Routes } from '@angular/router';
import { BrandsConfig } from '../configs/brands.config';
import { RoutesConfig } from '../configs/routes.config';
import { EnvironmentService } from '../../../services/environment/environment.service';
import { of } from 'rxjs/observable/of';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { environment } from '../../../../environments/environment';
import { RequestQueryService } from '@libs/environment/services/queries/request-query.service';

@Injectable()
export class BrandParamsService {
  private brandLangSubject$ = new ReplaySubject<string>(1);

  constructor(@Inject(BrandsConfig) private brandsConfig,
              @Inject(RoutesConfig) private routesConfig,
              private requestQueryService: RequestQueryService,
              private environmentService: EnvironmentService) {
    this.getConfig('common', 'langId')
      .subscribe((langId: string) => this.brandLangSubject$.next(langId));
  }

  getURL(): string {
    return this.requestQueryService.getLocationOrigin();
  }

  getBrandId(): string {
    let brandId = this.environmentService.getEnvironmentData('brandId');
    if (!brandId) {
      brandId = getBrandId(this.requestQueryService.getHost());
    }
    return brandId;
  }

  getLangId(): Observable<string> {
    return this.brandLangSubject$.asObservable();
  }

  setLangId(langId: string) {
    this.brandLangSubject$.next(langId);
  }

  getConfig(group: string, value?: string): Observable<any> {
    const brandId = this.getBrandId();
    const defaultConfig = this.brandsConfig['BIGLOTTERYOWIN_COM'];
    const brandConfig = this.brandsConfig[brandId];

    if (!defaultConfig) {
      throw new Error('No default brand config found');
    }

    if (!brandConfig) {
      return null;
    }

    let brandResult = brandConfig[group];
    let defaultResult = defaultConfig[group];

    if (typeof value !== 'undefined') {
      if (brandResult) {
        brandResult = brandResult[value];
      }

      if (defaultResult) {
        defaultResult = defaultResult[value];
      }
    }

    return typeof brandResult !== 'undefined' ? of(brandResult) : of(defaultResult);
  }

  getRoutes(): Routes {
    const brandId = this.getBrandId();
    return this.routesConfig[brandId];
  }

  getApiUrl() {
    return getApiUrl(this.getBrandId(), this.environmentService.getEnvironmentData('environment'));
  }

  getCmsUrl(): Observable<string> {
    const baseUrl = environment.environment === 'local' ? 'https://development.biglotteryowin.co.uk' : this.getURL();

    return this.getLangId()
      .map((langId: string) => {
        langId = langId === 'en' ? '' : langId + '/';
        return `${baseUrl}/${langId}wp-json/wp/v2/lottery_pages`;
      });
  }

  getPaymentSystemData(): Observable<any> {
    const env = this.environmentService.getEnvironmentData('environment');
    return this.getConfig('paymentSystem', env);
  }

  getBrandSiteUrl(brandId: string) {
    return getSiteUrl(brandId, this.environmentService.getEnvironmentData('environment'));
  }

}
