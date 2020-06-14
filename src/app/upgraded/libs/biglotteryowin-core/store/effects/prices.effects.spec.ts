import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { cold, hot } from 'jasmine-marbles';

import { OfferingsApiQueryService } from '@libs/biglotteryowin-api/services/queries/offerings-api-query.service';

import { BrandQueryService } from '../../services/queries/brand-query.service';
import { PricesEffects } from './prices.effects';
import { PricesLoadAction, PricesLoadSuccessAction } from '../actions/prices.actions';

const pricesStub = require('@libs/biglotteryowin-api/stubs/offerings/prices.stub.json');

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

describe('PricesEffects', () => {
  let actions: TestActions;
  let effects: PricesEffects;
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
            getPrices: of(pricesStub)
          })
        },
        PricesEffects,
      ],
    });

    actions = TestBed.get(Actions);
    effects = TestBed.get(PricesEffects);
    service = TestBed.get(OfferingsApiQueryService);
  });

  describe('loadPrices$', () => {
    it('should return a collection from PricesLoadSuccessAction', () => {
      const action = new PricesLoadAction();
      const completion = new PricesLoadSuccessAction(pricesStub as any);

      actions.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadPrices$).toBeObservable(expected);
    });
  });
});
