import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LotteryInfoCmsBasedContainerComponent } from './lottery-info-cms-based.container.component';
import { LotteryInfoCmsBasedComponent } from './components/lottery-info-cms-based/lottery-info-cms-based.component';
import { WhyBoxModule } from './modules/why-box/why-box.module';
import { RouterModule } from '@angular/router';
import { HowToPlayBoxModule } from './modules/how-to-play-box/how-to-play-box.module';
import { FaqBoxModule } from './modules/faq-box/faq-box.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    WhyBoxModule,
    HowToPlayBoxModule,
    FaqBoxModule
  ],
  declarations: [
    LotteryInfoCmsBasedContainerComponent,
    LotteryInfoCmsBasedComponent
  ],
  exports: [
    LotteryInfoCmsBasedContainerComponent
  ]
})
export class LotteryInfoCmsBasedModule { }
