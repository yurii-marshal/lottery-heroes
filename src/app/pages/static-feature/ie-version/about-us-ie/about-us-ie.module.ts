import { NgModule } from '@angular/core';
import { AboutUsIeRoutingModule } from './about-us-ie-routing.module';
import { SharedModule } from '../../../../modules/shared/shared.module';
import { AboutWrapperModule } from '../../../../modules/about/about-wrapper.module';
import { AboutUsIeComponent } from './about-us-ie.component';

@NgModule({
  imports: [
    SharedModule,
    AboutUsIeRoutingModule,
    AboutWrapperModule,
  ],
  declarations: [
    AboutUsIeComponent,
  ]
})
export class AboutUsIeModule { }
