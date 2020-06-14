import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { first, tap } from 'rxjs/operators';

import { ScripterCommandService } from '@libs/scripter/services/commands/scripter-command.service';
import { BrandQueryService } from '@libs/biglotteryowin-core/services/queries/brand-query.service';

import { HOTJAR_PLUGIN_CONFIG } from '../configs/hotjar-plugin.config';

@Injectable()
export class HotjarPluginEffects {
  private config: {[key: string]: any};

  constructor(private actions$: Actions,
              private scripterCommandService: ScripterCommandService,
              brandQueryService: BrandQueryService,
              @Inject(HOTJAR_PLUGIN_CONFIG) hotjarPluginConfig: {[brandId: string]: object}) {
    const brandId = brandQueryService.getBrandId();
    this.config = hotjarPluginConfig[brandId];
  }

  @Effect({dispatch: false})
  hotjarTrackingCode$ = this.actions$
    .ofType(ROUTER_NAVIGATION)
    .pipe(
      first(),
      tap(() => {
        this.scripterCommandService.addScript('hotjar-tracking-code', `{
                (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:${this.config['hotjarId']},hjsv:5};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
                })(window,document,'//static.hotjar.com/c/hotjar-','.js?sv=');
              }`, 'head');
      })
    );
}
