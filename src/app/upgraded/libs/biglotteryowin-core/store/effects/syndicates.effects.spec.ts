import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { cold, hot } from 'jasmine-marbles';

import { OfferingsApiQueryService } from '@libs/biglotteryowin-api/services/queries/offerings-api-query.service';

import { BrandQueryService } from '../../services/queries/brand-query.service';
import { SyndicatesCommandService } from '../../services/commands/syndicates-command.service';
import { SyndicatesEffects } from '../effects/syndicates.effects';
import { SyndicatesLoadAction, SyndicatesLoadSuccessAction } from '../actions/syndicates.actions';

const syndicatesStub = require('@libs/biglotteryowin-api/stubs/offerings/syndicates.stub.json');

export class TestActions extends Actions {
  constructor() {
    super(empty());
  }

  set stream(source: Observable<any>) {
    // this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

describe('SyndicatesEffects', () => {
  let actions: TestActions;
  let effects: SyndicatesEffects;
  let offeringsApiQueryService: jasmine.SpyObj<OfferingsApiQueryService>;
  let syndicatesCommandService: jasmine.SpyObj<SyndicatesCommandService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Actions,
          useFactory: getActions
        },
        {
          provide: BrandQueryService,
          useValue: jasmine.createSpyObj<BrandQueryService>('BrandQueryService', {
            getBrandId: 'BIGLOTTERYOWIN_COM'
          })
        },
        {
          provide: OfferingsApiQueryService,
          useValue: jasmine.createSpyObj<OfferingsApiQueryService>('OfferingsApiQueryService', {
            getSyndicates: of(syndicatesStub)
          })
        },
        {
          provide: SyndicatesCommandService,
          useValue: jasmine.createSpyObj<SyndicatesCommandService>('SyndicatesCommandService', ['scheduleRefresh'])
        },
        SyndicatesEffects,
      ],
    });

    actions = TestBed.get(Actions);
    effects = TestBed.get(SyndicatesEffects);
    offeringsApiQueryService = TestBed.get(OfferingsApiQueryService);
    syndicatesCommandService = TestBed.get(SyndicatesCommandService);
  });

  describe('loadSyndicates$', () => {
    it('should return a collection from SyndicatesLoadSuccessAction', () => {
      const action = new SyndicatesLoadAction();
      const completion = new SyndicatesLoadSuccessAction(syndicatesStub);

      actions.stream = hot('-a', {a: action});
      const expected = cold('-b', {b: completion});

      expect(effects.loadSyndicates$).toBeObservable(expected);
      expect(offeringsApiQueryService.getSyndicates).toHaveBeenCalledWith('BIGLOTTERYOWIN_COM');
    });
  });

  describe('refreshSyndicates$', () => {
    it('should schedule refresh on success load', () => {
      const action = new SyndicatesLoadSuccessAction(syndicatesStub);

      actions.stream = hot('-a', {a: action});

      effects.refreshSyndicates$.subscribe(() => {
        expect(syndicatesCommandService.scheduleRefresh).toHaveBeenCalledWith(syndicatesStub);
      });
    });
  });
});
