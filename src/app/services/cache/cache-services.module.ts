import { NgModule, ModuleWithProviders } from '@angular/core';

import { MemoryCacheService } from './memory-cache.service';

@NgModule()
export class CacheServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CacheServicesModule,
      providers: [
        MemoryCacheService,
      ]
    };
  }
}
