import { initialOffersState, offersReducer } from './offers.reducer';
import { OffersLoadAction, OffersLoadFailAction, OffersLoadSuccessAction } from '../actions/offers.actions';
import { offersEntitiesStub } from '../../stubs/offers-entities.stub';

const offersStub = require('@libs/biglotteryowin-api/stubs/offerings/offers.stub.json');

describe('offersReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = offersReducer(undefined, action);

      expect(state).toBe(initialOffersState);
    });
  });

  describe('OffersLoadAction', () => {
    it('should set loading to true', () => {
      const action = new OffersLoadAction();
      const state = offersReducer(initialOffersState, action);

      expect(state.loading).toEqual(true);
    });
  });

  describe('OffersLoadSuccessAction', () => {
    it('should populate entities', () => {
      const action = new OffersLoadSuccessAction(offersStub as any);
      const state = offersReducer(initialOffersState, action);

      expect(state.entities).toEqual(offersEntitiesStub as any);
      expect(state.loading).toEqual(false);
      expect(state.loaded).toEqual(true);
    });
  });

  describe('OffersLoadFailAction', () => {
    it('should set loading to false', () => {
      const previousState = { ...initialOffersState, loading: true };
      const action = new OffersLoadFailAction({});
      const state = offersReducer(previousState, action);

      expect(state.loading).toEqual(false);
    });
  });
});
