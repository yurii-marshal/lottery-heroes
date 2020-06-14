import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AboutLotteryPageContainerComponent } from './about-lottery-page-container.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AboutLotteryPageContainerComponent,
      }
    ])
  ],
  exports: [RouterModule]
})
export class AboutLotteryPageRoutingModule {
}
