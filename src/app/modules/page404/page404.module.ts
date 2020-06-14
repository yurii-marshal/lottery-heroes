import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { Page404Component } from './page404.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
  ],
  declarations: [
    Page404Component,
  ],
  exports: [
    Page404Component,
  ]
})
export class Page404Module {
}
