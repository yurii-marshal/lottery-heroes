import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LotteryWidgetSimilarComponent } from './components/lottery-widget-similar.component';
import { LotteryWidgetSimilarContainerComponent } from './lottery-widget-similar.container.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    LotteryWidgetSimilarContainerComponent,
    LotteryWidgetSimilarComponent
  ],
  exports: [
    LotteryWidgetSimilarContainerComponent
  ]
})
export class LotteryWidgetSimilarModule { }
