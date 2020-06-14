import { NgModule } from '@angular/core';
import { ProductContainerComponent } from './product.container.component';
import { TicketsPageModule } from '../tickets-page/tickets-page.module';
import { SyndicatePageModule } from '../syndicate-page/syndicate-page.module';
import { SharedModule } from '../../modules/shared/shared.module';
import { ProductRoutingModule } from './product-routing.module';
import { Page404Module } from '../../modules/page404/page404.module';

@NgModule({
  imports: [
    SharedModule,
    ProductRoutingModule,
    TicketsPageModule,
    SyndicatePageModule,
    Page404Module
  ],
  declarations: [
    ProductContainerComponent
  ]
})
export class ProductModule {}
