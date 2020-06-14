import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponsibleGamingRoutingModule } from './responsible-gaming-routing.module';
import { ResponsibleGamingComponent } from './responsible-gaming.component';


@NgModule({
  imports: [
    CommonModule,
    ResponsibleGamingRoutingModule
  ],
  declarations: [ResponsibleGamingComponent]
})
export class ResponsibleGamingModule { }
