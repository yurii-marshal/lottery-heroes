import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { hot } from 'jasmine-marbles';

import { ScripterCommandService } from '@libs/scripter/services/commands/scripter-command.service';
import { RequestQueryService } from '@libs/environment/services/queries/request-query.service';
import { BrandQueryService } from '@libs/biglotteryowin-core/services/queries/brand-query.service';

import { SchemaPluginEffects } from './schema-plugin.effects';
import { SCHEMA_PLUGIN_CONFIG, schemaPluginConfig } from '../configs/schema-plugin.config';
import { APP_CONFIG, appConfig } from '../../../configs/app.config';
import { DrawsQueryService } from '@libs/biglotteryowin-core/services/queries/draws-query.service';
import { LotteriesQueryService } from '@libs/biglotteryowin-core/services/queries/lotteries-query.service';

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

describe('SchemaPluginEffects', () => {
  let actions: TestActions;
  let effects: SchemaPluginEffects;
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
          useValue: jasmine.createSpyObj<ScripterCommandService>('ScripterCommandService', ['addScript', 'removeScript'])
        },
        {
          provide: LotteriesQueryService,
          useValue: jasmine.createSpyObj<LotteriesQueryService>('LotteriesQueryService', ['getLotteryModelById'])
        },
        {
          provide: DrawsQueryService,
          useValue: jasmine.createSpyObj<DrawsQueryService>('DrawsQueryService', ['getDrawByDateLocal'])
        },
        {
          provide: RequestQueryService,
          useValue: jasmine.createSpyObj<RequestQueryService>('RequestQueryService', {
            getLocationOrigin: 'https://www.biglotteryowin.com'
          })
        },
        {
          provide: BrandQueryService,
          useValue: jasmine.createSpyObj<BrandQueryService>('BrandQueryService', {
            getBrandId: 'BIGLOTTERYOWIN_COM'
          })
        },
        {
          provide: SCHEMA_PLUGIN_CONFIG,
          useValue: schemaPluginConfig
        },
        {
          provide: APP_CONFIG,
          useValue: appConfig
        },
        SchemaPluginEffects,
      ],
    });

    actions = TestBed.get(Actions);
    effects = TestBed.get(SchemaPluginEffects);
    scripterCommandService = TestBed.get(ScripterCommandService);
  });

  describe('websiteInfo$', () => {
    it('should add website info schema', () => {
      const action = {type: ROUTER_NAVIGATION};

      actions.stream = hot('-a', {a: action});

      effects.websiteInfo$.subscribe(() => {
        expect(scripterCommandService.addScript.calls.argsFor(0)[0]).toBe('website-info-schema');
        expect(scripterCommandService.addScript.calls.argsFor(0)[1]['@type']).toBe('WebSite');
      });
    });
  });

  describe('homeInfo$', () => {
    it('should not add home info schema if it is not home page', () => {
      const action = {type: ROUTER_NAVIGATION, payload: {routerState: {urlWithoutQueryParams: '/any'}}};

      actions.stream = hot('-a', {a: action});

      effects.homeInfo$.subscribe(() => {
        expect(scripterCommandService.removeScript).toHaveBeenCalledTimes(1);
        expect(scripterCommandService.removeScript).toHaveBeenCalledWith('home-info-schema');
        expect(scripterCommandService.addScript).not.toHaveBeenCalled();
      });
    });

    it('should add home info schema', () => {
      const action = {type: ROUTER_NAVIGATION, payload: {routerState: {urlWithoutQueryParams: '/'}}};

      actions.stream = hot('-a', {a: action});

      effects.homeInfo$.subscribe(() => {
        expect(scripterCommandService.removeScript).toHaveBeenCalledTimes(1);
        expect(scripterCommandService.removeScript).toHaveBeenCalledWith('home-info-schema');

        expect(scripterCommandService.addScript).toHaveBeenCalledTimes(1);
        expect(scripterCommandService.addScript.calls.argsFor(0)[0]).toBe('home-info-schema');
        expect(scripterCommandService.addScript.calls.argsFor(0)[1]['@type']).toBe('Corporation');
      });
    });
  });

  describe('lotteries$', () => {
    it('should add lotteries breadcrumbs schema', () => {
      const action = {type: ROUTER_NAVIGATION, payload: {routerState: {urlWithoutQueryParams: '/lotteries'}}};

      actions.stream = hot('-a', {a: action});

      effects.homeInfo$.subscribe(() => {
        expect(scripterCommandService.removeScript).toHaveBeenCalledTimes(1);
        expect(scripterCommandService.removeScript).toHaveBeenCalledWith('lotteries-schema');

        expect(scripterCommandService.addScript).toHaveBeenCalledTimes(1);
        expect(scripterCommandService.addScript.calls.argsFor(0)[0]).toBe('lotteries-schema');
        expect(scripterCommandService.addScript.calls.argsFor(0)[1]['@type']).toBe('BreadcrumbList');
      });
    });
  });

  describe('lotteryTickets$', () => {
    it('should add lotteries tickets breadcrumbs schema', () => {
      const action = {
        type: ROUTER_NAVIGATION, payload: {
          routerState: {
            data: {pageType: 'lottery'},
          }
        }
      };

      actions.stream = hot('-a', {a: action});

      effects.homeInfo$.subscribe(() => {
        expect(scripterCommandService.removeScript).toHaveBeenCalledTimes(1);
        expect(scripterCommandService.removeScript).toHaveBeenCalledWith('lottery-tickets-schema');

        expect(scripterCommandService.addScript).toHaveBeenCalledTimes(1);
        expect(scripterCommandService.addScript.calls.argsFor(0)[0]).toBe('lottery-tickets-schema');
        expect(scripterCommandService.addScript.calls.argsFor(0)[1]['@type']).toBe('BreadcrumbList');
      });
    });
  });

  describe('lotteriesResults$', () => {
    it('should add lotteries results breadcrumbs schema', () => {
      const action = {type: ROUTER_NAVIGATION, payload: {routerState: {urlWithoutQueryParams: '/lotteries/results'}}};

      actions.stream = hot('-a', {a: action});

      effects.homeInfo$.subscribe(() => {
        expect(scripterCommandService.removeScript).toHaveBeenCalledTimes(1);
        expect(scripterCommandService.removeScript).toHaveBeenCalledWith('lottery-results-schema');

        expect(scripterCommandService.addScript).toHaveBeenCalledTimes(1);
        expect(scripterCommandService.addScript.calls.argsFor(0)[0]).toBe('lottery-results-schema');
        expect(scripterCommandService.addScript.calls.argsFor(0)[1]['@type']).toBe('BreadcrumbList');
      });
    });
  });

  describe('resultsPerLottery$', () => {
    it('should add results per lottery breadcrumbs schema', () => {
      const action = {
        type: ROUTER_NAVIGATION, payload: {
          routerState: {
            data: {pageType: 'result-lottery'},
          }
        }
      };

      actions.stream = hot('-a', {a: action});

      effects.homeInfo$.subscribe(() => {
        expect(scripterCommandService.removeScript).toHaveBeenCalledTimes(1);
        expect(scripterCommandService.removeScript).toHaveBeenCalledWith('results-per-lottery-schema');

        expect(scripterCommandService.addScript).toHaveBeenCalledTimes(1);
        expect(scripterCommandService.addScript.calls.argsFor(0)[0]).toBe('results-per-lottery-schema');
        expect(scripterCommandService.addScript.calls.argsFor(0)[1]['@type']).toBe('BreadcrumbList');
      });
    });
  });

  describe('resultsPerDraw$', () => {
    it('should add results per draw breadcrumbs schema', () => {
      const action = {
        type: ROUTER_NAVIGATION, payload: {
          routerState: {
            data: {pageType: 'result-draw'},
          }
        }
      };

      actions.stream = hot('-a', {a: action});

      effects.homeInfo$.subscribe(() => {
        expect(scripterCommandService.removeScript).toHaveBeenCalledTimes(1);
        expect(scripterCommandService.removeScript).toHaveBeenCalledWith('results-per-draw-schema');

        expect(scripterCommandService.addScript).toHaveBeenCalledTimes(1);
        expect(scripterCommandService.addScript.calls.argsFor(0)[0]).toBe('results-per-draw-schema');
        expect(scripterCommandService.addScript.calls.argsFor(0)[1]['@type']).toBe('BreadcrumbList');
      });
    });
  });
});
