import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BetVsPlayContainerComponent } from './bet-vs-play.container.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: BetVsPlayContainerComponent }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class BetVsPlayRoutingModule {
}
