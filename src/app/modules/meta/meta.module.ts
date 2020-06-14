import { NgModule, ModuleWithProviders } from '@angular/core';

import { MetaService } from './services/meta.service';

@NgModule()
export class MetaModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MetaModule,
      providers: [
        MetaService,
      ]
    };
  }
}
