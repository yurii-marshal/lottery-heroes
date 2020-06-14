import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../modules/shared/shared.module';

import { ListCombosContainerComponent } from './list-combos-container.component';
import { ListCombosComponent } from './components/list-combos/list-combos.component';
import { ComboLotteriesModule } from '../combo-lotteries/combo-lotteries.module';
import { ListCombosItemComponent } from './components/list-combos-item/list-combos-item.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    ComboLotteriesModule
  ],
  declarations: [
    ListCombosContainerComponent,
    ListCombosComponent,
    ListCombosItemComponent
  ],
  exports: [
    ListCombosContainerComponent
  ],
})
export class ListCombosModule {
}
