import {NgModule} from '@angular/core';
import {DepositComponent} from './components/deposit/deposit.component';
import {DepositRoutingModule} from './deposit-routing.module';
import {WishToWithdrawComponent} from './components/wish-to-withdraw/wish-to-withdraw.component';
import {ResponseDepositComponent} from './components/response-deposit/response-deposit.component';
import {PaymentModule} from '../../../modules/payment/payment.module';
import {SharedModule} from '../../../modules/shared/shared.module';

@NgModule({
  imports: [
    DepositRoutingModule,
    PaymentModule,
    SharedModule
  ],
  declarations: [DepositComponent, WishToWithdrawComponent, ResponseDepositComponent]
})
export class DepositModule {
}
