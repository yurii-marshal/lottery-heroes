import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../modules/shared/shared.module';

import { TopCombosContainerComponent } from './top-combos-container.component';
import { TopCombosComponent } from './components/top-combos/top-combos.component';
import { ComboLotteriesModule } from '../combo-lotteries/combo-lotteries.module';
import { TopCombosItemComponent } from './components/top-combos-item/top-combos-item.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    ComboLotteriesModule
  ],
  declarations: [
    TopCombosContainerComponent,
    TopCombosComponent,
    TopCombosItemComponent
  ],
  exports: [
    TopCombosContainerComponent
  ],
})
export class TopCombosModule {
}
