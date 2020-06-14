import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxesService } from './services/lightboxes.service';
import { LightboxesComponent } from './lightboxes.component';
import { GeneralComponent } from './components/general/general.component';
import { BrandModule } from '../brand/brand.module';
import { LiveChatModule } from '../live-chat/live-chat.module';
import { DepositLimitLightboxComponent } from './components/deposit-limit-lightbox/deposit-limit-lightbox';
import { SharedModule } from '../shared/shared.module';
import { DeleteCartItemLightboxComponent } from './components/delete-cart-item-lightbox/delete-cart-item-lightbox';
import { DeleteCartLineLightboxComponent } from './components/delete-cart-line-lightbox/delete-cart-line-lightbox';
import { EditLineLightboxComponent } from './components/edit-line-lightbox/edit-line-lightbox.component';
import {
  SubscriptionsCartLightboxComponent
} from './components/subscriptions-cart-lightbox/subscriptions-cart-lightbox.component';
import { RedirectionLimitLightboxComponent } from './components/redirection-limit-lightbox/redirection-limit-lightbox';
import { SyndicateLightboxComponent } from './components/syndicate-lightbox/syndicate-lightbox.component';

@NgModule({
  imports: [
    CommonModule,
    BrandModule,
    LiveChatModule,
    SharedModule,
  ],
  declarations: [
    LightboxesComponent,
    GeneralComponent,
    DepositLimitLightboxComponent,
    DeleteCartItemLightboxComponent,
    DeleteCartLineLightboxComponent,
    EditLineLightboxComponent,
    SubscriptionsCartLightboxComponent,
    RedirectionLimitLightboxComponent,
    SyndicateLightboxComponent,
  ],
  exports: [
    LightboxesComponent,
  ]
})
export class LightboxesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LightboxesModule,
      providers: [
        LightboxesService,
      ]
    };
  }
}
