import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivacyPolicyComponent } from './privacy-policy.component';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: PrivacyPolicyComponent}
    ])
  ],
  exports: [RouterModule],
  providers: []
})
export class PrivacyPolicyRoutingModule { }
