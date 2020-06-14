import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { syndicatePageReducer } from './store/reducers';
import { SyndicatePageEffects } from './store/effects/syndicate-page.effects';

import { StepsModule } from '../../modules/steps/steps.module';
import { LotteryInfoModule } from '../../modules/lottery-info/lottery-info.module';
import { LotteryInfoCmsBasedModule } from '../../modules/lottery-info-cms-based/lottery-info-cms-based.module';
import { FaqCmsModule } from '../../modules/faq-cms/faq-cms.module';
import { OtherLotteriesModule } from '../../modules/other-lotteries/other-lotteries.module';
import { SyndicateBodyDesktopModule } from './modules/syndicate-body-desktop/syndicate-body-desktop.module';
import { SyndicateTotalDesktopModule } from './modules/syndicate-total-desktop/syndicate-total-desktop.module';
import { SyndicateHeaderMobileModule } from './modules/syndicate-header-mobile/syndicate-header-mobile.module';
import { SyndicateBodyMobileModule } from './modules/syndicate-body-mobile/syndicate-body-mobile.module';
import { SyndicateTotalMobileModule } from './modules/syndicate-total-mobile/syndicate-total-mobile.module';

import { SyndicatePageContainerComponent } from './syndicate-page-container.component';
import { SyndicateDesktopPageComponent } from './components/syndicate-desktop-page/syndicate-desktop-page.component';
import { SyndicateMobilePageComponent } from './components/syndicate-mobile-page/syndicate-mobile-page.component';
import {SharedModule} from '../../modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
      SharedModule,
    StoreModule.forFeature('SyndicatePage', syndicatePageReducer),
    EffectsModule.forFeature([SyndicatePageEffects]),
    StepsModule,
    LotteryInfoModule,
    LotteryInfoCmsBasedModule,
    FaqCmsModule,
    OtherLotteriesModule,
    SyndicateBodyDesktopModule,
    SyndicateTotalDesktopModule,
    SyndicateHeaderMobileModule,
    SyndicateBodyMobileModule,
    SyndicateTotalMobileModule,
  ],
  declarations: [
    SyndicatePageContainerComponent,
    SyndicateDesktopPageComponent,
    SyndicateMobilePageComponent,
  ],
  exports: [
    SyndicatePageContainerComponent
  ]
})
export class SyndicatePageModule {
}
