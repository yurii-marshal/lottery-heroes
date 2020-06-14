import { TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { LotteryDto } from '@libs/biglotteryowin-api/dto/lotteries/get-lotteries.dto';

import { getLotteriesEntities, getLotteriesLoaded, getLotteriesLoading, getLotteriesState } from './lotteries.selectors';
import { biglotteryowinCoreReducers, BiglotteryowinCoreState } from '../reducers';
import { LotteriesLoadAction, LotteriesLoadSuccessAction } from '../actions/lotteries.actions';
import { lotteryEntitiesStub } from '../../stubs/lottery-entities.stub';

const lotteriesStub = require('@libs/biglotteryowin-api/stubs/lotteries/lotteries.stub.json');

describe('Lotteries Selectors', () => {
  let store: Store<BiglotteryowinCoreState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          'BiglotteryowinCore': combineReducers(biglotteryowinCoreReducers),
        }),
      ],
    });

    store = TestBed.get(Store);
  });

  describe('getLotteriesState', () => {
    it('should return state of lotteries store slice', () => {
      let result;

      store
        .select(getLotteriesState)
        .subscribe(value => (result = value));

      expect(result).toEqual({
        entities: {},
        loading: false,
        loaded: false,
      });

      store.dispatch(new LotteriesLoadSuccessAction(lotteriesStub as LotteryDto[]));

      expect(result).toEqual({
        entities: lotteryEntitiesStub,
        loading: false,
        loaded: true,
      });
    });
  });

  describe('getLotteriesEntities', () => {
    it('should return lotteries as entities', () => {
      let result;

      store
        .select(getLotteriesEntities)
        .subscribe(value => (result = value));

      expect(result).toEqual({});

      store.dispatch(new LotteriesLoadSuccessAction(lotteriesStub as LotteryDto[]));

      expect(result).toEqual(lotteryEntitiesStub);
    });
  });

  describe('getLotteriesLoading', () => {
    it('should return lotteries loading state', () => {
      let result;

      store
        .select(getLotteriesLoading)
        .subscribe(value => (result = value));

      expect(result).toEqual(false);

      store.dispatch(new LotteriesLoadAction());

      expect(result).toEqual(true);
    });
  });

  describe('getLotteriesLoaded', () => {
    it('should return lotteries loaded state', () => {
      let result;

      store
        .select(getLotteriesLoaded)
        .subscribe(value => (result = value));

      expect(result).toEqual(false);

      store.dispatch(new LotteriesLoadSuccessAction([]));

      expect(result).toEqual(true);
    });
  });
});
