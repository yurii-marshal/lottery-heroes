import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { StepsComponent } from './steps.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  declarations: [
    StepsComponent
  ],
  exports: [
    StepsComponent
  ]
})
export class StepsModule {
}
