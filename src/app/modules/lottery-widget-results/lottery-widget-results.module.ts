import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LotteryWidgetResultsComponent } from './component/lottery-widget-results.component';
import { LotteryWidgetResultsContainerComponent } from './lottery-widget-results.container.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    LotteryWidgetResultsComponent,
    LotteryWidgetResultsContainerComponent
  ],
  exports: [
    LotteryWidgetResultsContainerComponent
  ]
})
export class LotteryWidgetResultsModule { }
