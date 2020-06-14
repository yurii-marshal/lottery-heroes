import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AboutUsInnerUkRoutingModule} from './about-us-inner-uk-routing.module';
import {AboutWrapperModule} from '../../../../modules/about/about-wrapper.module';
import {AboutUsInnerUKComponent} from './about-us-inner-uk.component';
import {SharedModule} from '../../../../modules/shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        AboutWrapperModule,
        AboutUsInnerUkRoutingModule
    ],
    declarations: [AboutUsInnerUKComponent]
})
export class AboutUsInnerUkModule {
}
