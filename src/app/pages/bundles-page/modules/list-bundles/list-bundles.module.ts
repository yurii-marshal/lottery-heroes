import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../../../modules/shared/shared.module';
import {BundleLotteriesModule} from '../bundle-lotteries/bundle-lotteries.module';
import {ListBundlesContainerComponent} from './list-bundles-container.component';
import {ListBundlesComponent} from './components/list-bundles/list-bundles.component';
import {ListBundlesItemComponent} from './components/list-bundles-item/list-bundles-item.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    BundleLotteriesModule
  ],
  declarations: [
    ListBundlesContainerComponent,
    ListBundlesComponent,
    ListBundlesItemComponent
  ],
  exports: [
    ListBundlesContainerComponent
  ],
})
export class ListBundlesModule {
}
