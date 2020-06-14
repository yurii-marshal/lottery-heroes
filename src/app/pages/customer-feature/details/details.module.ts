import {NgModule} from '@angular/core';

import {DetailsComponent} from './components/details/details.component';
import {DetailsRoutingModule} from './details-routing.module';
import {PersonalDetailsComponent} from './components/personal-details/personal-details.component';
import {SharedModule} from '../../../modules/shared/shared.module';
import {SubscriptionPreferencesComponent} from './components/subscription-preferences/subscription-preferences.component';

@NgModule({
  imports: [
    SharedModule,
    DetailsRoutingModule,
  ],
  declarations: [
    DetailsComponent,
    PersonalDetailsComponent,
    SubscriptionPreferencesComponent,
  ]
})
export class DetailsModule {
}
