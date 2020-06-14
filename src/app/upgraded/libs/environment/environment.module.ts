import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { ENVIRONMENT } from './tokens/environment.token';
import { EnvironmentQueryService } from './services/queries/environment-query.service';
import { RequestQueryService } from './services/queries/request-query.service';

@NgModule()
export class EnvironmentModule {
  constructor(@Optional() @SkipSelf() parentModule: EnvironmentModule) {
    if (parentModule) {
      throw new Error('EnvironmentModule is already loaded.');
    }
  }

  static forRoot(environment: {[key: string]: any}): ModuleWithProviders {
    return {
      ngModule: EnvironmentModule,
      providers: [
        {provide: ENVIRONMENT, useValue: environment},
        EnvironmentQueryService,
        RequestQueryService,
      ]
    };
  }
}
