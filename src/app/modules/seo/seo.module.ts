import { NgModule, Optional, SkipSelf } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { SeoEffects } from './effects/seo.effects';
import { SeoCommandService } from './services/seo-command.service';
import { PAGE_EXCLUSIONS_CONFIG, pageExclusionsConfig } from './configs/page-exclusions.conf';
import { MetaLinkService } from './services/meta-link.service';

@NgModule({
  imports: [
    EffectsModule.forFeature([
      SeoEffects
    ]),
  ],
  providers: [
    SeoCommandService,
    MetaLinkService,
    {provide: PAGE_EXCLUSIONS_CONFIG, useValue: pageExclusionsConfig},
  ],
})
export class SeoModule {
  constructor (@Optional() @SkipSelf() parentModule: SeoModule) {
    if (parentModule) {
      throw new Error(
        'SeoModule is already loaded. Import it in the AppModule only');
    }
  }
}
