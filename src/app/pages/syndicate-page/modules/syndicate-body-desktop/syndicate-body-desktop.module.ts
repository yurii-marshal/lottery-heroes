import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SyndicateBodyDesktopContainerComponent} from './syndicate-body-desktop.container.component';
import {SyndicateBodyDesktopComponent} from './components/syndicate-body-desktop.component';
import {SharedModule} from '../../../../modules/shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
    ],
    declarations: [
        SyndicateBodyDesktopContainerComponent,
        SyndicateBodyDesktopComponent,
    ],
    exports: [
        SyndicateBodyDesktopContainerComponent,
    ]
})

export class SyndicateBodyDesktopModule {
}
