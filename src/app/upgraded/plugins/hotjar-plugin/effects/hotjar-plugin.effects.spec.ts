import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { hot } from 'jasmine-marbles';

import { ScripterCommandService } from '@libs/scripter/services/commands/scripter-command.service';
import { BrandQueryService } from '@libs/biglotteryowin-core/services/queries/brand-query.service';

import { HotjarPluginEffects } from './hotjar-plugin.effects';
import { HOTJAR_PLUGIN_CONFIG } from '../configs/hotjar-plugin.config';

export class TestActions extends Actions {
  constructor() {
    super(empty());
  }

  set stream(source: Observable<any>) {
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

describe('HotjarPluginEffects', () => {
  let actions: TestActions;
  let effects: HotjarPluginEffects;
  let scripterCommandService: jasmine.SpyObj<ScripterCommandService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Actions,
          useFactory: getActions
        },
        {
          provide: ScripterCommandService,
          useValue: jasmine.createSpyObj<ScripterCommandService>('ScripterCommandService', ['addScript'])
        },
        {
          provide: BrandQueryService,
          useValue: jasmine.createSpyObj<BrandQueryService>('BrandQueryService', {
            getBrandId: 'BIGLOTTERYOWIN_COM'
          })
        },
        {
          provide: HOTJAR_PLUGIN_CONFIG,
          useValue: {BIGLOTTERYOWIN_COM: {hotjarId: '1087197'}}
        },
        HotjarPluginEffects,
      ],
    });

    actions = TestBed.get(Actions);
    effects = TestBed.get(HotjarPluginEffects);
    scripterCommandService = TestBed.get(ScripterCommandService);
  });

  describe('hotjarTrackingCode$', () => {
    it('should add hotjar code', () => {
      const action = {type: ROUTER_NAVIGATION};

      actions.stream = hot('-a', {a: action});

      effects.hotjarTrackingCode$.subscribe(() => {
        expect(scripterCommandService.addScript.calls.argsFor(0)[0]).toBe('hotjar-tracking-code');
        expect(scripterCommandService.addScript.calls.argsFor(0)[1]).toContain('hjid:1087197');
      });
    });
  });
});
