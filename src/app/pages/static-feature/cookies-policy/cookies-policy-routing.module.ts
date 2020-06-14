import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CookiesPolicyComponent} from './cookies-policy.component';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: CookiesPolicyComponent}
    ])
  ],
  exports: [RouterModule],
  providers: []
})
export class CookiesPolicyRoutingModule { }
