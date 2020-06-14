import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferBestOddsComboBoxComponent } from './components/offer-best-odds-combo-box/offer-best-odds-combo-box.component';
import { SharedModule } from '../../../../modules/shared/shared.module';
import { RouterModule } from '@angular/router';
import { OfferBestOddsComboBoxContainerComponent } from './offer-best-odds-combo-box.container.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    OfferBestOddsComboBoxContainerComponent,
    OfferBestOddsComboBoxComponent
  ],
  exports: [
    OfferBestOddsComboBoxContainerComponent
  ],
  entryComponents: [
    OfferBestOddsComboBoxContainerComponent
  ]
})
export class OfferBestOddsComboBoxModule { }
