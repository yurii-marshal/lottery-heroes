import { NgModule } from '@angular/core';
import { AboutUsUkComponent } from './about-us-uk.component';
import { AboutUsUkRoutingModule } from './about-us-uk-routing.module';
import { SharedModule } from '../../../../modules/shared/shared.module';
import { AboutWrapperModule } from '../../../../modules/about/about-wrapper.module';

@NgModule({
  imports: [
    SharedModule,
    AboutUsUkRoutingModule,
    AboutWrapperModule,
  ],
  declarations: [
    AboutUsUkComponent,
  ]
})
export class AboutUsUkModule {
}
