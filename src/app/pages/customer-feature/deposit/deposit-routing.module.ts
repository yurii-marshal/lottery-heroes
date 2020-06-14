import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DepositComponent} from './components/deposit/deposit.component';
import {ComingSoonComponent} from '../../../modules/coming-soon/coming-soon.component';
import {ComingSoonModule} from '../../../modules/coming-soon/coming-soon.module';

@NgModule({
  imports: [
    ComingSoonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DepositComponent
      },
      {
        path: 'payment-failure-limited',
        component: ComingSoonComponent,
      },
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class DepositRoutingModule {
}
