import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ThankYouPageContainerComponent} from './thank-you-page-container.component';
import {ThankYouPageComponent} from './components/thank-you-page/thank-you-page.component';

import {ListCombosModule} from '../combos-page/modules/list-combos/list-combos.module';
import {ThankYouPageRoutingModule} from './thank-you-page-routing.module';
import {WhatsNextModule} from './modules/whats-next/whats-next.module';
import {FollowUsModule} from './modules/follow-us/follow-us.module';
import {ListOfOptionsModule} from './modules/list-of-options/list-of-options.module';
import {SharedModule} from '../../modules/shared/shared.module';
import {ListBundlesModule} from '../bundles-page/modules/list-bundles/list-bundles.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ThankYouPageRoutingModule,
        ListCombosModule,
        ListBundlesModule,
        WhatsNextModule,
        FollowUsModule,
        ListOfOptionsModule,
    ],
    declarations: [
        ThankYouPageContainerComponent,
        ThankYouPageComponent,
    ]
})
export class ThankYouPageModule {
}
