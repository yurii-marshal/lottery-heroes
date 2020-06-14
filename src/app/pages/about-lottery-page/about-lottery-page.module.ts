import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutLotteryPageComponent } from './components/about-lottery-page/about-lottery-page.component';
import { AboutLotteryPageContainerComponent } from './about-lottery-page-container.component';
import { AboutLotteryPageRoutingModule } from './about-lottery-page-routing.module';
import { SharedModule } from '../../modules/shared/shared.module';
import { LotteryWidgetsModule } from '../../modules/lottery-widgets/lottery-widgets.module';
import { Page404Module } from '../../modules/page404/page404.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LotteryWidgetsModule,
    AboutLotteryPageRoutingModule,
    Page404Module
  ],
  declarations: [
    AboutLotteryPageContainerComponent,
    AboutLotteryPageComponent,
  ]
})
export class AboutLotteryPageModule {
}
