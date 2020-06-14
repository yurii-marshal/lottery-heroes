import { NgModule } from '@angular/core';

import { ResultsRoutingModule } from './results-routing.module';
import { SocialModule } from '../../../modules/social/social.module';
import { ResultsContainerComponent } from './containers/results.container.component';
import { ResultsItemContainerComponent } from './containers/results-item.container.component';
import { ResultsComponent } from './components/results/results.component';
import { ResultsItemComponent } from './components/results-item/results-item.component';
import { SharedModule } from '../../../modules/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ResultsRoutingModule,
    SocialModule,
  ],
  declarations: [
    ResultsContainerComponent,
    ResultsItemContainerComponent,
    ResultsComponent,
    ResultsItemComponent,
  ]
})
export class ResultsModule {
}
