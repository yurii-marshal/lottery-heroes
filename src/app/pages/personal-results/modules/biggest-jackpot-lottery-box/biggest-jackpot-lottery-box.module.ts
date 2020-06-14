import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiggestJackpotLotteryBoxComponent } from './components/biggest-jackpot-lottery-box/biggest-jackpot-lottery-box.component';
import { BiggestJackpotLotteryBoxContainerComponent } from './biggest-jackpot-lottery-box.container.component';
import { JackpotFormatPipe } from '../../../../modules/shared/pipes/jackpot-format.pipe';
import { SharedModule } from '../../../../modules/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    BiggestJackpotLotteryBoxContainerComponent,
    BiggestJackpotLotteryBoxComponent
  ],
  exports: [
    BiggestJackpotLotteryBoxContainerComponent
  ],
  providers: [
    JackpotFormatPipe
  ],
  entryComponents: [
    BiggestJackpotLotteryBoxContainerComponent
  ]
})
export class BiggestJackpotLotteryBoxModule { }
