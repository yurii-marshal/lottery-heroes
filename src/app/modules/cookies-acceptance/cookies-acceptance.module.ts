import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {BrandModule} from '../brand/brand.module';
import {CookiesAcceptanceComponent} from './cookies-acceptance.component';
import {LightboxesService} from '../lightboxes/services/lightboxes.service';

@NgModule({
  imports: [
    CommonModule,
    BrandModule,
    SharedModule,
  ],
  declarations: [
    CookiesAcceptanceComponent,
  ],
  exports: [
    CookiesAcceptanceComponent,
  ]
})
export class CookiesAcceptanceModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CookiesAcceptanceModule,
      providers: [
        LightboxesService,
      ]
    };
  }
}
