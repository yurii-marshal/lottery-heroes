import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AboutUsInnerRoutingModule} from './about-us-inner-routing.module';
import {AboutWrapperModule} from '../../../modules/about/about-wrapper.module';
import {AboutUsInnerComponent} from './about-us-inner.component';
import {SharedModule} from '../../../modules/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    AboutWrapperModule,
    AboutUsInnerRoutingModule
  ],
  declarations: [AboutUsInnerComponent]
})
export class AboutUsInnerModule {
}
