import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BetterOddsOfferBoxComponent } from './components/better-odds-offer-box/better-odds-offer-box.component';
import { BetterOddsOfferBoxContainerComponent } from './better-odds-offer-box.container.component';
import { JackpotFormatPipe } from '../../../../modules/shared/pipes/jackpot-format.pipe';
import { SharedModule } from '../../../../modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    BetterOddsOfferBoxContainerComponent,
    BetterOddsOfferBoxComponent
  ],
  exports: [
    BetterOddsOfferBoxContainerComponent
  ],
  providers: [
    JackpotFormatPipe
  ],
  entryComponents: [
    BetterOddsOfferBoxContainerComponent
  ]
})
export class BetterOddsOfferBoxModule { }
