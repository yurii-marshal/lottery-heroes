import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SubscribeLinesBoxComponent} from './components/subscribe-lines-box/subscribe-lines-box.component';
import {SubscribeLinesBoxContainerComponent} from './subscribe-lines-box.container.component';
import {SharedModule} from '../../../../modules/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [
        SubscribeLinesBoxComponent,
        SubscribeLinesBoxContainerComponent
    ],
    exports: [
        SubscribeLinesBoxContainerComponent
    ],
    entryComponents: [
        SubscribeLinesBoxContainerComponent
    ]
})
export class SubscribeLinesBoxModule {
}
