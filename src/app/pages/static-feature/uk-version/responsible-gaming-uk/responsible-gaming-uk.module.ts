import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ResponsibleGamingUkRoutingModule} from './responsible-gaming-uk-routing.module';
import {ResponsibleGamingUkComponent} from './responsible-gaming-uk.component';
import {SharedModule} from '../../../../modules/shared/shared.module';


@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        ResponsibleGamingUkRoutingModule
    ],
    declarations: [ResponsibleGamingUkComponent]
})
export class ResponsibleGamingUkModule {
}
