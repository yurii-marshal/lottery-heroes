import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../modules/shared/shared.module';
import {MainBundleModule} from './modules/main-bundle/main-bundle.module';
import {TopBundlesModule} from './modules/top-bundles/top-bundles.module';
import {ListBundlesModule} from './modules/list-bundles/list-bundles.module';
import {BundlesPageRoutingModule} from './bundles-page-routing.module';
import {BundlesPageComponent} from './components/bundles-page.component';
import {BundlesPageContainerComponent} from './bundles-page.container.component';

@NgModule({
    imports: [
        CommonModule,
        BundlesPageRoutingModule,
        MainBundleModule,
        TopBundlesModule,
        ListBundlesModule,
        SharedModule
    ],
    declarations: [
        BundlesPageContainerComponent,
        BundlesPageComponent,
    ]
})
export class BundlesPageModule {
}
