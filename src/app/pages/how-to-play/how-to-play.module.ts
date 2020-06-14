import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HowToPlayComponent} from './components/how-to-play/how-to-play.component';
import {HowToPlayContainerComponent} from './how-to-play-container.component';
import {HowToPlayRoutingModule} from './how-to-play-routing.module';
import {Page404Module} from '../../modules/page404/page404.module';
import {SharedModule} from '../../modules/shared/shared.module';


@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        HowToPlayRoutingModule,
        Page404Module,
    ],
    declarations: [
        HowToPlayContainerComponent,
        HowToPlayComponent,
    ],
})
export class HowToPlayModule {
}
