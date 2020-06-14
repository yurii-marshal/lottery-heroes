import { ModuleWithProviders, NgModule } from '@angular/core';

import { TranslateDirective } from './directives/translate.directive';
import { BrandTranslateService } from './services/brand-translate.service';
import { BrandParamsService } from './services/brand-params.service';
import { BrandsConfig, brandsConfig } from './configs/brands.config';
import { RoutesConfig, routesConfig } from './configs/routes.config';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TranslateDirective
  ],
  exports: [
    TranslateDirective
  ]
})
export class BrandModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: BrandModule,
      providers: [
        BrandTranslateService,
        BrandParamsService,
        {provide: BrandsConfig, useValue: brandsConfig},
        {provide: RoutesConfig, useValue: routesConfig},
      ]
    };
  }
}
