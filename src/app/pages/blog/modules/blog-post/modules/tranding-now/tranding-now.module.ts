import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TrandingNowComponent } from './components/tranding-now/tranding-now.component';
import { TrandingNowContainerComponent } from './tranding-now.container.component';
import { SharedModule } from '../../../../../../modules/shared/shared.module';
import { TrandingNowVerticalComponent } from './components/tranding-now-vertical/tranding-now-vertical.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
  ],
  declarations: [
    TrandingNowComponent,
    TrandingNowVerticalComponent,
    TrandingNowContainerComponent
  ],
  exports: [
    TrandingNowContainerComponent
  ]
})
export class TrandingNowModule { }
