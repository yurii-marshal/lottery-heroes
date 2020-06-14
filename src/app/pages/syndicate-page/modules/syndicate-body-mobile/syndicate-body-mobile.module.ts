import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SyndicateTotalMobileModule} from '../syndicate-total-mobile/syndicate-total-mobile.module';
import {SyndicateBodyMobileComponent} from './components/syndicate-body-mobile.component';
import {SyndicateBodyMobileContainerComponent} from './syndicate-body-mobile.container.component';
import {SharedModule} from '../../../../modules/shared/shared.module';


@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        SyndicateTotalMobileModule,
    ],
    declarations: [
        SyndicateBodyMobileContainerComponent,
        SyndicateBodyMobileComponent,
    ],
    exports: [
        SyndicateBodyMobileContainerComponent,
    ]
})

export class SyndicateBodyMobileModule {
}
