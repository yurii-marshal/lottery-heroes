import { NgModule, ModuleWithProviders } from '@angular/core';

import { LuvSecureApiService } from './luv-secure.api.service';
import { CustomerApiService } from './customer.api.service';
import { WalletApiService } from './wallet.api.service';
import { LinesApiService } from './lines.api.service';
import { BaseSecureApiService } from './base-secure.api.service';
import { SessionApiService } from './session.api.service';
import { LuckyNumbersApiService } from './lucky-numbers.api.service';

@NgModule()
export class ApiServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ApiServicesModule,
      providers: [
        CustomerApiService,
        BaseSecureApiService,
        SessionApiService,
        LuvSecureApiService,
        WalletApiService,
        LinesApiService,
        LuckyNumbersApiService,
      ]
    };
  }
}
