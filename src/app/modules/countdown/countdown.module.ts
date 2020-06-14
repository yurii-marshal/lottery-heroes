import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseCountdownComponent } from './components/base-countdown/base-countdown.component';
import { SimpleCountdownComponent } from './components/simple-countdown/simple-countdown.component';
import { BigCountdownComponent } from './components/big-countdown/big-countdown.component';
import { HomePromoCountdownComponent } from './components/home-promo-countdown/home-promo-countdown.component';
import { FlippedCountdownComponent } from './components/flipped-countdown/flipped-countdown.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    BaseCountdownComponent,
    SimpleCountdownComponent,
    BigCountdownComponent,
    HomePromoCountdownComponent,
    FlippedCountdownComponent
  ],
  exports: [
    BaseCountdownComponent,
    SimpleCountdownComponent,
    BigCountdownComponent,
    HomePromoCountdownComponent,
    FlippedCountdownComponent
  ],
})
export class CountdownModule {
}
