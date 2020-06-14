import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownModule } from '../../../../modules/countdown/countdown.module';

import { SyndicateTotalDesktopContainerComponent } from './syndicate-total-desktop.container.component';
import { SyndicateTotalDesktopComponent } from './components/syndicate-total-desktop.component';
import { SharedModule } from '../../../../modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    CountdownModule,
    SharedModule,
  ],
  declarations: [
    SyndicateTotalDesktopContainerComponent,
    SyndicateTotalDesktopComponent
  ],
  exports: [
    SyndicateTotalDesktopContainerComponent
  ]
})

export class SyndicateTotalDesktopModule {
}
