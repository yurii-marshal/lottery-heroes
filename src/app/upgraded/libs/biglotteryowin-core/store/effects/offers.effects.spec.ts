import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { cold, hot } from 'jasmine-marbles';

import { OfferingsApiQueryService } from '@libs/biglotteryowin-api/services/queries/offerings-api-query.service';

import { BrandQueryService } from '../../services/queries/brand-query.service';
import { OffersEffects } from './offers.effects';
import { OffersLoadAction, OffersLoadSuccessAction } from '../actions/offers.actions';

const offersStub = require('@libs/biglotteryowin-api/stubs/offerings/offers.stub.json');

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

describe('OffersEffects', () => {
  let actions: TestActions;
  let effects: OffersEffects;
  let service: jasmine.SpyObj<OfferingsApiQueryService>;

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
            getOffers: of(offersStub)
          })
        },
        OffersEffects,
      ],
    });

    actions = TestBed.get(Actions);
    effects = TestBed.get(OffersEffects);
    service = TestBed.get(OfferingsApiQueryService);
  });

  describe('loadOffers$', () => {
    it('should return a collection from OffersLoadSuccessAction', () => {
      const action = new OffersLoadAction();
      const completion = new OffersLoadSuccessAction(offersStub as any);

      actions.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadOffers$).toBeObservable(expected);
    });
  });
});
