import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ResponsibleGamingComponent } from './responsible-gaming.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: ResponsibleGamingComponent}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ResponsibleGamingRoutingModule { }
