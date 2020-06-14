import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../modules/shared/shared.module';

import { ComboLotteriesComponent } from './combo-lotteries.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule
  ],
  declarations: [
    ComboLotteriesComponent
  ],
  exports: [
    ComboLotteriesComponent
  ],
})
export class ComboLotteriesModule {
}
