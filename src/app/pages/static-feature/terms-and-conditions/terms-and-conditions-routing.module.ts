import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TermsAndConditionsComponent} from './terms-and-conditions.component';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: TermsAndConditionsComponent}
    ])
  ],
  exports: [RouterModule],
  providers: []
})
export class TermsAndConditionsRoutingModule {
}
