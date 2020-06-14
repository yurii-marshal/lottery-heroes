import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutUsComponent } from './about-us.component';
import { AboutusRoutingModule } from './aboutus-routing.module';
import { AboutWrapperModule } from '../../../modules/about/about-wrapper.module';


@NgModule({
  imports: [
    CommonModule,
    AboutusRoutingModule,
    AboutWrapperModule
  ],
  declarations: [AboutUsComponent]
})
export class AboutUsModule { }
