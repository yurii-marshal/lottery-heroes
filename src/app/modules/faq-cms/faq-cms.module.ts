import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { LotteryWidgetsModule } from '../lottery-widgets/lottery-widgets.module';
import { FaqCmsContainerComponent } from './faq-cms.container.component';
import { FaqCmsComponent } from './components/faq-cms/faq-cms.component';

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    LotteryWidgetsModule,
  ],
  declarations: [
    FaqCmsContainerComponent,
    FaqCmsComponent
  ],
  exports: [
    FaqCmsContainerComponent,
  ],
})
export class FaqCmsModule {
}
