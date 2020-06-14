import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../modules/shared/shared.module';
import { AboutWrapperModule } from '../../../../modules/about/about-wrapper.module';
import { SafeAndSecureUkRoutingModule } from './safe-and-secure-uk-routing.module';
import { SafeAndSecureUkComponent } from './safe-and-secure-uk.component';
import { SafeAndSecureUkContainerComponent } from './safe-and-secure-uk.container.component';
import { Page404Module } from '../../../../modules/page404/page404.module';

@NgModule({
  imports: [
    SharedModule,
    Page404Module,
    AboutWrapperModule,
    SafeAndSecureUkRoutingModule,
  ],
  declarations: [ SafeAndSecureUkComponent, SafeAndSecureUkContainerComponent]
})

export class SafeAndSecureUkModule {
}
