import { NgModule, ModuleWithProviders } from '@angular/core';

import { BaseApiService } from './base.api.service';
import { LuvApiService } from './luv.api.service';
import { LotteriesApiService } from './lotteries.api.service';
import { OfferingsApiService } from './offerings.api.service';
import { VisitorCountryApiService } from './visitor-country.api.service';
import { ContactUsApiService } from './contact-us.api.service';
import { CartApiService } from './cart.api.service';
import { BrandService } from './brand.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeadersInterceptor } from './headers.interceptor';

@NgModule()
export class PackageApiServicesModule {
  static forRoot(config: any): ModuleWithProviders {
    return {
      ngModule: PackageApiServicesModule,
      providers: [
        BaseApiService,
        LuvApiService,
        LotteriesApiService,
        OfferingsApiService,
        VisitorCountryApiService,
        ContactUsApiService,
        CartApiService,
        BrandService,
        {provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true},
        {provide: 'environment', useValue: config}
      ]
    };
  }
}
