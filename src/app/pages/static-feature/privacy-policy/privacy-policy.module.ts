import { NgModule } from '@angular/core';

import { PrivacyPolicyRoutingModule } from './privacy-policy-routing.module';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { SharedModule } from '../../../modules/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    PrivacyPolicyRoutingModule
  ],
  declarations: [PrivacyPolicyComponent]
})
export class PrivacyPolicyModule {
}
