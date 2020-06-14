import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { cold, hot } from 'jasmine-marbles';

import { LuvApiQueryService } from '@libs/biglotteryowin-api/services/queries/luv-api-query.service';

import { BrandsEffects } from './brands.effects';
import { BrandsLoadAction, BrandsLoadSuccessAction } from '../actions/brands.actions';

const brandsStub = require('@libs/biglotteryowin-api/stubs/luv/brands.stub.json');

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

describe('BrandsEffects', () => {
  let actions: TestActions;
  let effects: BrandsEffects;
  let service: jasmine.SpyObj<LuvApiQueryService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Actions,
          useFactory: getActions
        },
        {
          provide: LuvApiQueryService,
          useValue: jasmine.createSpyObj<LuvApiQueryService>('LuvApiQueryService', {
            getBrands: of(brandsStub)
          })
        },
        BrandsEffects,
      ],
    });

    actions = TestBed.get(Actions);
    effects = TestBed.get(BrandsEffects);
    service = TestBed.get(LuvApiQueryService);
  });

  describe('loadBrands$', () => {
    it('should return a collection from BrandsLoadSuccessAction', () => {
      const action = new BrandsLoadAction();
      const completion = new BrandsLoadSuccessAction(brandsStub as any);

      actions.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadBrands$).toBeObservable(expected);
    });
  });
});
