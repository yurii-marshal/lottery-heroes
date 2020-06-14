import { NgModule } from '@angular/core';

import { FaqUkComponent } from './faq-uk.component';
import { FaqUkRoutingModule } from './faq-uk-routing.module';
import { SharedModule } from '../../../../modules/shared/shared.module';
import { AboutWrapperModule } from '../../../../modules/about/about-wrapper.module';

@NgModule({
  imports: [
    SharedModule,
    FaqUkRoutingModule,
    AboutWrapperModule,
  ],
  declarations: [
    FaqUkComponent,
  ]
})
export class FaqUkModule {
}
