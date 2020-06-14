import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LinesComponent } from './lines/lines.component';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: LinesComponent}
    ])
  ],
  exports: [RouterModule],
  providers: []
})
export class LinesRoutingModule { }
