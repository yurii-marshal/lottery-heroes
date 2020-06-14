import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CombosPageRoutingModule} from './combos-page-routing.module';
import {CombosPageContainerComponent} from './combos-page.container.component';
import {CombosPageComponent} from './components/combos-page.component';
import {MainComboModule} from './modules/main-combo/main-combo.module';
import {TopCombosModule} from './modules/top-combos/top-combos.module';
import {ListCombosModule} from './modules/list-combos/list-combos.module';
import {SharedModule} from '../../modules/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        CombosPageRoutingModule,
        MainComboModule,
        TopCombosModule,
        ListCombosModule,
        SharedModule
    ],
    declarations: [
        CombosPageContainerComponent,
        CombosPageComponent,
    ]
})
export class CombosPageModule {
}
