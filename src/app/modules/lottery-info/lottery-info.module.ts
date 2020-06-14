import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { LotteryWidgetsModule } from '../lottery-widgets/lottery-widgets.module';

import { LotteryInfoContainerComponent } from './lottery-info.container.component';
import { LotteryInfoComponent } from './components/lottery-info/lottery-info.component';
import { LotteryNewsComponent } from './components/lottery-news/lottery-news.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    LotteryWidgetsModule,
  ],
  declarations: [
    LotteryInfoContainerComponent,
    LotteryInfoComponent,
    LotteryNewsComponent,
  ],
  exports: [
    LotteryInfoContainerComponent,
  ],
})
export class LotteryInfoModule {
}
