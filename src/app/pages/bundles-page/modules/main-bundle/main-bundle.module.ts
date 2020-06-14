import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../../../modules/shared/shared.module';
import {BundleLotteriesModule} from '../bundle-lotteries/bundle-lotteries.module';
import {MainBundleContainerComponent} from './main-bundle-container.component';
import {MainBundleComponent} from './main-bundle.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    BundleLotteriesModule
  ],
  declarations: [
    MainBundleContainerComponent,
    MainBundleComponent
  ],
  exports: [
    MainBundleContainerComponent
  ],
})
export class MainBundleModule {
}
