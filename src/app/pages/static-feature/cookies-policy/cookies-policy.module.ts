import { NgModule } from '@angular/core';
import { SharedModule } from '../../../modules/shared/shared.module';
import {CookiesPolicyRoutingModule} from './cookies-policy-routing.module';
import {CookiesPolicyComponent} from './cookies-policy.component';

@NgModule({
  imports: [
    SharedModule,
    CookiesPolicyRoutingModule
  ],
  declarations: [CookiesPolicyComponent]
})
export class CookiesPolicyModule {
}
