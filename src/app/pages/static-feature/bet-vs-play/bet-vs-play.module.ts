import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BetVsPlayComponent } from './bet-vs-play.component';
import { BetVsPlayRoutingModule } from './bet-vs-play-routing.module';
import { BetVsPlayContainerComponent } from './bet-vs-play.container.component';
import { SharedModule } from '../../../modules/shared/shared.module';
import { Page404Module } from '../../../modules/page404/page404.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    Page404Module,
    BetVsPlayRoutingModule
  ],
  declarations: [BetVsPlayComponent, BetVsPlayContainerComponent]
})
export class BetVsPlayModule {
}
