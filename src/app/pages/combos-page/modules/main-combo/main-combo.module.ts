import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../modules/shared/shared.module';

import { MainComboContainerComponent } from './main-combo-container.component';
import { MainComboComponent } from './main-combo.component';
import { ComboLotteriesModule } from '../combo-lotteries/combo-lotteries.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    ComboLotteriesModule
  ],
  declarations: [
    MainComboContainerComponent,
    MainComboComponent
  ],
  exports: [
    MainComboContainerComponent
  ],
})
export class MainComboModule {
}
