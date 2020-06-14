import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { cold, hot } from 'jasmine-marbles';

import { LotteriesApiQueryService } from '@libs/biglotteryowin-api/services/queries/lotteries-api-query.service';

import { CurrencyQueryService } from '../../services/queries/currency-query.service';
import { DrawsCommandService } from '../../services/commands/draws-command.service';
import { DrawsEffects } from './draws.effects';
import {
  DrawByDateLocalLoadAction,
  DrawByDateLocalLoadSuccessAction,
  DrawsByIdLoadAction,
  DrawsByIdLoadSuccessAction,
  LatestDrawsLoadAction,
  LatestDrawsLoadSuccessAction,
  UpcomingDrawsLoadAction,
  UpcomingDrawsLoadSuccessAction
} from '../actions/draws.actions';

const drawsStub = require('@libs/biglotteryowin-api/stubs/lotteries/draws.stub.json');
const getSingleDrawStub = require('@libs/biglotteryowin-api/stubs/lotteries/get-single-draw.stub.json');

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

describe('DrawsEffects', () => {
  let actions: TestActions;
  let effects: DrawsEffects;
  let lotteriesApiQueryService: jasmine.SpyObj<LotteriesApiQueryService>;
  let drawsCommandService: jasmine.SpyObj<DrawsCommandService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Actions,
          useFactory: getActions
        },
        {
          provide: CurrencyQueryService,
          useValue: jasmine.createSpyObj<CurrencyQueryService>('CurrencyQueryService', {
            getSiteCurrencyId: of('GBP')
          })
        },
        {
          provide: LotteriesApiQueryService,
          useValue: jasmine.createSpyObj<LotteriesApiQueryService>('LotteriesApiQueryService', {
            getDraws: of(drawsStub),
            getDrawsById: of(drawsStub),
            getDrawByDateLocal: of(getSingleDrawStub),
          })
        },
        {
          provide: DrawsCommandService,
          useValue: jasmine.createSpyObj<DrawsCommandService>('DrawsCommandService', ['scheduleRefresh'])
        },
        DrawsEffects,
      ],
    });

    actions = TestBed.get(Actions);
    effects = TestBed.get(DrawsEffects);
    lotteriesApiQueryService = TestBed.get(LotteriesApiQueryService);
    drawsCommandService = TestBed.get(DrawsCommandService);
  });

  describe('loadUpcomingDraws$', () => {
    it('should return a collection from UpcomingDrawsLoadSuccessAction', () => {
      const action = new UpcomingDrawsLoadAction();
      const completion = new UpcomingDrawsLoadSuccessAction(drawsStub);

      actions.stream = hot('-a', {a: action});
      const expected = cold('-b', {b: completion});

      expect(effects.loadUpcomingDraws$).toBeObservable(expected);
      expect(lotteriesApiQueryService.getDraws).toHaveBeenCalledWith({upcoming: true, currencyId: 'GBP'});
    });
  });

  describe('loadLatestDraws$', () => {
    it('should return a collection from LatestDrawsLoadSuccessAction', () => {
      const action = new LatestDrawsLoadAction();
      const completion = new LatestDrawsLoadSuccessAction(drawsStub);

      actions.stream = hot('-a', {a: action});
      const expected = cold('-b', {b: completion});

      expect(effects.loadLatestDraws$).toBeObservable(expected);
      expect(lotteriesApiQueryService.getDraws).toHaveBeenCalledWith({latest: true, currencyId: 'GBP'});
    });
  });

  describe('loadDrawsById$', () => {
    it('should return a DrawsByIdLoadSuccessAction', () => {
      const action = new DrawsByIdLoadAction([22999, 23887]);
      const completion = new DrawsByIdLoadSuccessAction(drawsStub);

      actions.stream = hot('-a', {a: action});
      const expected = cold('-b', {b: completion});

      expect(effects.loadDrawsById$).toBeObservable(expected);
      expect(lotteriesApiQueryService.getDrawsById).toHaveBeenCalledWith([22999, 23887], 'GBP');
    });
  });

  describe('loadDrawByDateLocal$', () => {
    it('should return a DrawByDateLocalLoadSuccessAction', () => {
      const action = new DrawByDateLocalLoadAction({lotteryId: 'powerball', dateLocal: '2018-03-28'});
      const completion = new DrawByDateLocalLoadSuccessAction(getSingleDrawStub);

      actions.stream = hot('-a', {a: action});
      const expected = cold('-b', {b: completion});

      expect(effects.loadDrawByDateLocal$).toBeObservable(expected);
      expect(lotteriesApiQueryService.getDrawByDateLocal).toHaveBeenCalledWith('powerball', '2018-03-28');
    });
  });

  describe('refreshDraws$', () => {
    it('should schedule refresh on success upcoming draws load', () => {
      const action = new UpcomingDrawsLoadSuccessAction(drawsStub);

      actions.stream = hot('-a', {a: action});

      effects.refreshDraws$.subscribe(() => {
        expect(drawsCommandService.scheduleRefresh).toHaveBeenCalledWith(drawsStub);
      });
    });
  });
});
