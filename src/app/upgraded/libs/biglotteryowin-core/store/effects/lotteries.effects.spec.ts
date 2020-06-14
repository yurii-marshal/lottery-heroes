import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { cold, hot } from 'jasmine-marbles';

import { LotteriesApiQueryService } from '@libs/biglotteryowin-api/services/queries/lotteries-api-query.service';

import { LotteriesEffects } from './lotteries.effects';
import { LotteriesLoadAction, LotteriesLoadSuccessAction } from '../actions/lotteries.actions';
import { BrandQueryService } from '../../services/queries/brand-query.service';

const lotteriesStub = require('@libs/biglotteryowin-api/stubs/lotteries/lotteries.stub.json');

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

describe('LotteriesEffects', () => {
  let actions: TestActions;
  let effects: LotteriesEffects;
  let service: jasmine.SpyObj<LotteriesApiQueryService>;

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
          provide: LotteriesApiQueryService,
          useValue: jasmine.createSpyObj<LotteriesApiQueryService>('LotteriesApiQueryService', {
            getLotteries: of(lotteriesStub)
          })
        },
        LotteriesEffects,
      ],
    });

    actions = TestBed.get(Actions);
    effects = TestBed.get(LotteriesEffects);
    service = TestBed.get(LotteriesApiQueryService);
  });

  describe('loadLotteries$', () => {
    it('should return a collection from LotteriesLoadSuccessAction', () => {
      const action = new LotteriesLoadAction();
      const completion = new LotteriesLoadSuccessAction(lotteriesStub as any);

      actions.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadLotteries$).toBeObservable(expected);
    });
  });
});
