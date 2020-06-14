import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HowToPlayStepsComponent } from './components/how-to-play-steps/how-to-play-steps.component';
import { HomeComponent } from './components/home/home.component';
import { ProtectionComponent } from './components/protection/protection.component';
import { CheckYourNumbersComponent } from './components/check-your-numbers/check-your-numbers.component';
import { MainJackpotComponent } from './components/main-jackpot/main-jackpot.component';
import { MainJackpotContainerComponent } from './containers/main-jackpot.container.component';
import { CountdownModule } from '../../modules/countdown/countdown.module';
import { ListOfPopularComponent } from './components/list-of-popular/list-of-popular.component';
import { ListOfPopularContainerComponent } from './containers/list-of-popular.container.component';
import { ListOfPopularItemComponent } from './components/list-of-popular-item/list-of-popular-item.component';
import { ListOfPopularItemContainerComponent } from './containers/list-of-popular-item.container.component';
import { LotteryWidgetsModule } from '../../modules/lottery-widgets/lottery-widgets.module';
import { CheckYourNumbersContainerComponent } from './containers/check-your-numbers.container.component';
import { SharedModule } from '../../modules/shared/shared.module';
import {
  LotteryWidgetWorldBiggestJackpotsModule
} from '../../modules/lottery-widget-world-biggest-jackpots/lottery-widget-world-biggest-jackpots.module';
import { LotteryWidgetResultsModule } from '../../modules/lottery-widget-results/lottery-widget-results.module';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    CountdownModule,
    LotteryWidgetsModule,
    LotteryWidgetWorldBiggestJackpotsModule,
    LotteryWidgetResultsModule,
    SharedModule,
  ],
  declarations: [
    HomeComponent,
    HowToPlayStepsComponent,
    ProtectionComponent,
    CheckYourNumbersComponent,
    MainJackpotComponent,
    MainJackpotContainerComponent,
    ListOfPopularComponent,
    ListOfPopularContainerComponent,
    ListOfPopularItemComponent,
    ListOfPopularItemContainerComponent,
    CheckYourNumbersContainerComponent
  ]
})
export class HomeModule { }
