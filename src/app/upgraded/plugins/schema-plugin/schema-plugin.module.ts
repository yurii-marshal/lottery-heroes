import { NgModule, Optional, SkipSelf } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { SchemaPluginEffects } from './effects/schema-plugin.effects';
import { SCHEMA_PLUGIN_CONFIG, schemaPluginConfig } from './configs/schema-plugin.config';

@NgModule({
  imports: [
    EffectsModule.forFeature([
      SchemaPluginEffects,
    ]),
  ],
  providers: [
    {provide: SCHEMA_PLUGIN_CONFIG, useValue: schemaPluginConfig}
  ]
})
export class SchemaPluginModule {
  constructor(@Optional() @SkipSelf() parentModule: SchemaPluginModule) {
    if (parentModule) {
      throw new Error('SchemaPluginModule is already loaded.');
    }
  }
}
