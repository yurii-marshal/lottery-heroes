import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductLinkDirective } from './directives/product-link.directive';
import { AnalyticsDeprecatedService } from './services/analytics-deprecated.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ProductLinkDirective,
  ],
  exports: [
    ProductLinkDirective,
  ]
})
export class AnalyticsDeprecatedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AnalyticsDeprecatedModule,
      providers: [
        AnalyticsDeprecatedService,
      ]
    };
  }
}
