import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ThankYouPageContainerComponent } from './thank-you-page-container.component';
import { AuthGuard } from '../../modules/ex-core/guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        canActivate: [
          AuthGuard,
        ],
        component: ThankYouPageContainerComponent
      }
    ]),
  ],
  exports: [
    RouterModule
  ]
})
export class ThankYouPageRoutingModule {
}
