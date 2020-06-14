import { NgModule, Optional, SkipSelf } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import {
  AnalyticsCartPageEffects, AnalyticsDepositPageEffects, AnalyticsThankYouPageEffects,
  AnalyticsTicketsPageEffects, AnalyticsLightboxesEffects, AnalyticsHeaderEffects,
  AnalyticsRegistrationPageEffects, AnalyticsCashierPageEffects, AnalyticsPersonalResultsPageEffects,
  AnalyticsHowToPlayPageEffects, AnalyticsSyndicatePageEffects, AnalyticsLotteryResultsPageEffects
} from './effects';
import { AnalyticsCommandService } from './services';

@NgModule({
  imports: [
    EffectsModule.forFeature([
      AnalyticsTicketsPageEffects,
      AnalyticsCartPageEffects,
      AnalyticsThankYouPageEffects,
      AnalyticsHeaderEffects,
      AnalyticsRegistrationPageEffects,
      AnalyticsCashierPageEffects,
      AnalyticsDepositPageEffects,
      AnalyticsLightboxesEffects,
      AnalyticsHowToPlayPageEffects,
      AnalyticsPersonalResultsPageEffects,
      AnalyticsSyndicatePageEffects,
      AnalyticsLotteryResultsPageEffects
    ]),
  ],
  providers: [
    AnalyticsCommandService,
  ],
})
export class AnalyticsModule {
  constructor (@Optional() @SkipSelf() parentModule: AnalyticsModule) {
    if (parentModule) {
      throw new Error(
        'AnalyticsModule is already loaded. Import it in the AppModule only');
    }
  }
}
