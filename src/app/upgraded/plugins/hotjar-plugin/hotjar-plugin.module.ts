import { NgModule, Optional, SkipSelf } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { HotjarPluginEffects } from './effects/hotjar-plugin.effects';
import { HOTJAR_PLUGIN_CONFIG, hotjarPluginConfig } from './configs/hotjar-plugin.config';

@NgModule({
  imports: [
    EffectsModule.forFeature([
      HotjarPluginEffects,
    ]),
  ],
  providers: [
    {provide: HOTJAR_PLUGIN_CONFIG, useValue: hotjarPluginConfig}
  ]
})
export class HotjarPluginModule {
  constructor(@Optional() @SkipSelf() parentModule: HotjarPluginModule) {
    if (parentModule) {
      throw new Error('HotjarPluginModule is already loaded.');
    }
  }
}
