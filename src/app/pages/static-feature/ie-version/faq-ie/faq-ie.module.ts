import { NgModule } from '@angular/core';

import { FaqIeRoutingModule } from './faq-ie-routing.module';
import { FaqIeComponent } from './faq-ie.component';
import { SharedModule } from '../../../../modules/shared/shared.module';
import { AboutWrapperModule } from '../../../../modules/about/about-wrapper.module';

@NgModule({
  imports: [
    SharedModule,
    FaqIeRoutingModule,
    AboutWrapperModule,
  ],
  declarations: [
    FaqIeComponent,
  ]
})
export class FaqIeModule {
}

