import { NgModule, Optional, SkipSelf } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';

import { CustomRouterStateSerializer } from './reducers';
import { RouterEffects } from './effects/router.effects';

@NgModule({
  imports: [
    StoreModule.forFeature('RouterStore', routerReducer),
    EffectsModule.forFeature([
      RouterEffects,
    ]),
    StoreRouterConnectingModule,
  ],
  providers: [
    {provide: RouterStateSerializer, useClass: CustomRouterStateSerializer},
  ],
})
export class RouterStoreModule {
  constructor(@Optional() @SkipSelf() parentModule: RouterStoreModule) {
    if (parentModule) {
      throw new Error('RouterStoreModule is already loaded.');
    }
  }
}
