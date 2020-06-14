import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComingSoonRoutingModule} from './coming-soon-routing.module';
import {ComingSoonComponent} from './coming-soon.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        ComingSoonRoutingModule
    ],
    declarations: [
        ComingSoonComponent
    ],
    exports: [
        ComingSoonComponent
    ]
})
export class ComingSoonModule {
}
