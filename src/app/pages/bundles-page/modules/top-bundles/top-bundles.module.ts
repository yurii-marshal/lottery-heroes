import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../../../modules/shared/shared.module';
import {BundleLotteriesModule} from '../bundle-lotteries/bundle-lotteries.module';
import {TopBundlesItemComponent} from './components/top-bundles-item/top-bundles-item.component';
import {TopBundlesContainerComponent} from './top-bundles-container.component';
import {TopBundlesComponent} from './components/top-bundles/top-bundles.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    BundleLotteriesModule
  ],
  declarations: [
    TopBundlesContainerComponent,
    TopBundlesComponent,
    TopBundlesItemComponent
  ],
  exports: [
    TopBundlesContainerComponent
  ],
})
export class TopBundlesModule {
}
