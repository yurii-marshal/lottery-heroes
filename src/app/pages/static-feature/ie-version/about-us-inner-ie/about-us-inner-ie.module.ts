import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AboutUsInnerIeRoutingModule} from './about-us-inner-ie-routing.module';
import {AboutWrapperModule} from '../../../../modules/about/about-wrapper.module';
import {AboutUsInnerIeComponent} from './about-us-inner-ie.component';
import {SharedModule} from '../../../../modules/shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        AboutWrapperModule,
        AboutUsInnerIeRoutingModule
    ],
    declarations: [AboutUsInnerIeComponent]
})
export class AboutUsInnerIeModule {
}
