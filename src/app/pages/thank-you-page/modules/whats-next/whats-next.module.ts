import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {WhatsNextContainerComponent} from './whats-next-container.component';
import {WhatsNextComponent} from './components/whats-next/whats-next.component';
import {SharedModule} from '../../../../modules/shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
    ],
    declarations: [
        WhatsNextContainerComponent,
        WhatsNextComponent,
    ],
    exports: [
        WhatsNextContainerComponent
    ]
})

export class WhatsNextModule {
}
