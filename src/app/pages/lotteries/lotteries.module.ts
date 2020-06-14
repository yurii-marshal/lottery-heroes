import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BrandModule} from '../../modules/brand/brand.module';
import {LotteriesRoutingModule} from './lotteries-routing.module';
import {LotteriesContainerComponent} from './lotteries-container.component';
import {LotteriesComponent} from './components/lotteries/lotteries.component';
import {LotteriesItemModule} from './modules/lotteries-item/lotteries-item.module';
import {SharedModule} from '../../modules/shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        LotteriesRoutingModule,
        LotteriesItemModule,
        BrandModule,
    ],
    declarations: [
        LotteriesContainerComponent,
        LotteriesComponent,
    ]
})
export class LotteriesModule {
}
