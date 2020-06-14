import {
  SyndicatesLoadAction, SyndicatesLoadFailAction,
  SyndicatesLoadSuccessAction
} from '../actions/syndicates.actions';
import { initialSyndicatesState, syndicatesReducer } from '../reducers/syndicates.reducer';
import { syndicateEntitiesStub } from '../../stubs/syndicate-entities.stub';

const syndicatesStub = require('@libs/biglotteryowin-api/stubs/offerings/syndicates.stub.json');

describe('syndicatesReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = syndicatesReducer(undefined, action);

      expect(state).toBe(initialSyndicatesState);
    });
  });

  describe('SyndicatesLoadAction', () => {
    it('should set loading to true', () => {
      const action = new SyndicatesLoadAction();
      const state = syndicatesReducer(initialSyndicatesState, action);

      expect(state.loading).toEqual(true);
    });
  });

  describe('SyndicatesLoadSuccessAction', () => {
    it('should populate entities', () => {
      const action = new SyndicatesLoadSuccessAction(syndicatesStub as any);
      const state = syndicatesReducer(initialSyndicatesState, action);

      expect(state.entities).toEqual(syndicateEntitiesStub as any);
      expect(state.loading).toEqual(false);
      expect(state.loaded).toEqual(true);
    });
  });

  describe('SyndicatesLoadFailAction', () => {
    it('should set loading to false', () => {
      const previousState = { ...initialSyndicatesState, loading: true };
      const action = new SyndicatesLoadFailAction({});
      const state = syndicatesReducer(previousState, action);

      expect(state.loading).toEqual(false);
    });
  });
});
