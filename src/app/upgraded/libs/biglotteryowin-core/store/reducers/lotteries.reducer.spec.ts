import { initialLotteriesState, lotteriesReducer } from './lotteries.reducer';
import { LotteriesLoadAction, LotteriesLoadFailAction, LotteriesLoadSuccessAction } from '../actions/lotteries.actions';
import { lotteryEntitiesStub } from '../../stubs/lottery-entities.stub';

const lotteriesStub = require('@libs/biglotteryowin-api/stubs/lotteries/lotteries.stub.json');

describe('lotteriesReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = lotteriesReducer(undefined, action);

      expect(state).toBe(initialLotteriesState);
    });
  });

  describe('LotteriesLoadAction', () => {
    it('should set loading to true', () => {
      const action = new LotteriesLoadAction();
      const state = lotteriesReducer(initialLotteriesState, action);

      expect(state.loading).toEqual(true);
    });
  });

  describe('LotteriesLoadSuccessAction', () => {
    it('should populate entities', () => {
      const action = new LotteriesLoadSuccessAction(lotteriesStub as any);
      const state = lotteriesReducer(initialLotteriesState, action);

      expect(state.entities).toEqual(lotteryEntitiesStub as any);
      expect(state.loading).toEqual(false);
      expect(state.loaded).toEqual(true);
    });
  });

  describe('LotteriesLoadFailAction', () => {
    it('should set loading to false', () => {
      const previousState = { ...initialLotteriesState, loading: true };
      const action = new LotteriesLoadFailAction({});
      const state = lotteriesReducer(previousState, action);

      expect(state.loading).toEqual(false);
    });
  });
});
