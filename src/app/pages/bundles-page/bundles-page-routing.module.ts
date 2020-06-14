import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BundlesPageContainerComponent} from './bundles-page.container.component';
import {OfferingsBundlesResolver} from '../../modules/ex-core/resolvers/offerings/offerings-bundles.resolver';
import {SortedByPriorityBundleListResolver} from '../../modules/ex-core/resolvers/bundles/sorted-by-priority-bundle-list.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: BundlesPageContainerComponent,
        resolve: {
          offeringsBundles: OfferingsBundlesResolver,
          bundleList: SortedByPriorityBundleListResolver
        },
        pathMatch: 'full'
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class BundlesPageRoutingModule {
}
