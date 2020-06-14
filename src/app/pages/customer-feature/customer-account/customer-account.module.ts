import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerAccountComponent} from './components/customer-account.component';
import {CustomerAccountRoutingModule} from './customer-account-routing.module';
import {SharedModule} from '../../../modules/shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        CustomerAccountRoutingModule
    ],
    declarations: [CustomerAccountComponent]
})
export class CustomerAccountModule {
}
