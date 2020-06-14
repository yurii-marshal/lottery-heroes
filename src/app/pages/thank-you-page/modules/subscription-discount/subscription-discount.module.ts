import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SubscriptionDiscountContainerComponent} from './subscription-discount-container.component';
import {SubscriptionDiscountComponent} from './components/subscription-discount/subscription-discount.component';
import {SharedModule} from '../../../../modules/shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
    ],
    declarations: [
        SubscriptionDiscountContainerComponent,
        SubscriptionDiscountComponent,
    ],
    exports: [
        SubscriptionDiscountContainerComponent
    ]
})

export class SubscriptionDiscountModule {
}
