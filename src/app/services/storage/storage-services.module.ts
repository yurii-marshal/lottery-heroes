import { NgModule, ModuleWithProviders } from '@angular/core';

import { WebStorageService } from './web-storage.service';

@NgModule()
export class StorageServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: StorageServicesModule,
      providers: [
        WebStorageService,
      ]
    };
  }
}
