import { NgModule } from '@angular/core';

import { FaqComponent } from './faq.component';
import { FaqRoutingModule } from './faq-routing.module';
import { SharedModule } from '../../../modules/shared/shared.module';
import { AboutWrapperModule } from '../../../modules/about/about-wrapper.module';

@NgModule({
  imports: [
    SharedModule,
    FaqRoutingModule,
    AboutWrapperModule
  ],
  declarations: [
    FaqComponent,
  ]
})
export class FaqModule {
}
