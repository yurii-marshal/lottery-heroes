import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../../modules/shared/shared.module';
import { CountdownModule } from '../../../../modules/countdown/countdown.module';
import { AnalyticsDeprecatedModule } from '../../../../modules/analytics-deprecated/analytics-deprecated.module';
import { LotteriesItemContainerComponent } from './lotteries-item-container.component';
import { LotteriesItemComponent } from './components/lotteries-item/lotteries-item.component';
import { LOTTERIES_ITEM_CONFIG, lotteriesItemConfig } from './configs/lotteries-item.config';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    CountdownModule,
    SharedModule,
    AnalyticsDeprecatedModule
  ],
  declarations: [
    LotteriesItemContainerComponent,
    LotteriesItemComponent
  ],
  providers: [
    {provide: LOTTERIES_ITEM_CONFIG, useValue: lotteriesItemConfig}
  ],
  exports: [
    LotteriesItemContainerComponent,
  ]
})
export class LotteriesItemModule {
}
