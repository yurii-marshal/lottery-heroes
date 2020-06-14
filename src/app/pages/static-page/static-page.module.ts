import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Page404Module } from '../../modules/page404/page404.module';
import { StaticPageRoutingModule } from './static-page-routing.module';
import { StaticPageContainerComponent } from './static-page-container.component';
import { StaticPageComponent } from './components/static-page/static-page.component';

@NgModule({
  imports: [
    CommonModule,
    StaticPageRoutingModule,
    Page404Module,
  ],
  declarations: [
    StaticPageContainerComponent,
    StaticPageComponent,
  ]
})
export class StaticPageModule {
}
