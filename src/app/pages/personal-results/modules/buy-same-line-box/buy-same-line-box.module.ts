import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuySameLineBoxComponent } from './components/buy-same-line-box/buy-same-line-box.component';
import { BuySameLineBoxContainerComponent } from './buy-same-line-box.container.component';
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
    BuySameLineBoxContainerComponent,
    BuySameLineBoxComponent
  ],
  exports: [
    BuySameLineBoxContainerComponent
  ],
  providers: [
    JackpotFormatPipe
  ],
  entryComponents: [
    BuySameLineBoxContainerComponent
  ]
})
export class BuySameLineBoxModule { }
