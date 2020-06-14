import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SyndicateHeaderMobileComponent } from './components/syndicate-header-mobile.component';
import { SyndicateHeaderMobileContainerComponent } from './syndicate-header-mobile.container.component';
import { CountdownModule } from '../../../../modules/countdown/countdown.module';
import { SharedModule } from '../../../../modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    CountdownModule,
    SharedModule,
  ],
  declarations: [
    SyndicateHeaderMobileContainerComponent,
    SyndicateHeaderMobileComponent,
  ],
  exports: [
    SyndicateHeaderMobileContainerComponent
  ]
})

export class SyndicateHeaderMobileModule {
}
