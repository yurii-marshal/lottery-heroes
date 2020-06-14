import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../modules/shared/shared.module';
import {BundleLotteriesComponent} from './bundle-lotteries.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule
  ],
  declarations: [
    BundleLotteriesComponent
  ],
  exports: [
    BundleLotteriesComponent
  ],
})
export class BundleLotteriesModule {
}
