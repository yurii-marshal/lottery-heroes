import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SyndicateTotalMobileContainerComponent} from './syndicate-total-mobile.container.component';
import {SyndicateTotalMobileComponent} from './components/syndicate-total-mobile.component';
import {SharedModule} from '../../../../modules/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [
        SyndicateTotalMobileContainerComponent,
        SyndicateTotalMobileComponent
    ],
    exports: [
        SyndicateTotalMobileContainerComponent
    ]
})

export class SyndicateTotalMobileModule {
}
