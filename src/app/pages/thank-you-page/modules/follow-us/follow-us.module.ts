import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FollowUsContainerComponent} from './follow-us-container.component';
import {FollowUsComponent} from './components/follow-us/follow-us.component';
import {SharedModule} from '../../../../modules/shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
    ],
    declarations: [
        FollowUsContainerComponent,
        FollowUsComponent,
    ],
    exports: [
        FollowUsContainerComponent
    ]
})

export class FollowUsModule {
}
