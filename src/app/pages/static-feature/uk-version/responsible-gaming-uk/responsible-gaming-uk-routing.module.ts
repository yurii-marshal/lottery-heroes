import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ResponsibleGamingUkComponent } from './responsible-gaming-uk.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: ResponsibleGamingUkComponent}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ResponsibleGamingUkRoutingModule { }
