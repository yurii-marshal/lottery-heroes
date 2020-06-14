import { NgModule, Optional, SkipSelf } from '@angular/core';

import { ScripterCommandService } from './services/commands/scripter-command.service';

@NgModule({
  providers: [
    ScripterCommandService,
  ]
})
export class ScripterModule {
  constructor(@Optional() @SkipSelf() parentModule: ScripterModule) {
    if (parentModule) {
      throw new Error('ScripterModule is already loaded.');
    }
  }
}
