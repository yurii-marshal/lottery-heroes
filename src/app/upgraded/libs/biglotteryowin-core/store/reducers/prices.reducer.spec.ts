import { initialPricesState, pricesReducer } from './prices.reducer';
import { PricesLoadAction, PricesLoadFailAction, PricesLoadSuccessAction } from '../actions/prices.actions';
import { pricesEntitiesStub } from '../../stubs/prices-entities.stub';

const pricesStub = require('@libs/biglotteryowin-api/stubs/offerings/prices.stub.json');

describe('pricesReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = pricesReducer(undefined, action);

      expect(state).toBe(initialPricesState);
    });
  });

  describe('PricesLoadAction', () => {
    it('should set loading to true', () => {
      const action = new PricesLoadAction();
      const state = pricesReducer(initialPricesState, action);

      expect(state.loading).toEqual(true);
    });
  });

  describe('LotteriesLoadSuccessAction', () => {
    it('should populate entities', () => {
      const action = new PricesLoadSuccessAction(pricesStub as any);
      const state = pricesReducer(initialPricesState, action);

      expect(state.entities).toEqual(pricesEntitiesStub as any);
      expect(state.loading).toEqual(false);
      expect(state.loaded).toEqual(true);
    });
  });

  describe('PricesLoadFailAction', () => {
    it('should set loading to false', () => {
      const previousState = { ...initialPricesState, loading: true };
      const action = new PricesLoadFailAction({});
      const state = pricesReducer(previousState, action);

      expect(state.loading).toEqual(false);
    });
  });
});
