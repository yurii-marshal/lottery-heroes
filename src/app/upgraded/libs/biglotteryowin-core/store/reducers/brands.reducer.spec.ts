import { BrandsLoadAction, BrandsLoadFailAction, BrandsLoadSuccessAction } from '../actions/brands.actions';
import { initialBrandsState, brandsReducer } from './brands.reducer';
import { brandEntitiesStub } from '../../stubs/brand-entities.stub';

const brandsStub = require('@libs/biglotteryowin-api/stubs/luv/brands.stub.json');

describe('brandsReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = brandsReducer(undefined, action);

      expect(state).toBe(initialBrandsState);
    });
  });

  describe('BrandsLoadAction', () => {
    it('should set loading to true', () => {
      const action = new BrandsLoadAction();
      const state = brandsReducer(initialBrandsState, action);

      expect(state.loading).toEqual(true);
    });
  });

  describe('BrandsLoadSuccessAction', () => {
    it('should populate entities', () => {
      const action = new BrandsLoadSuccessAction(brandsStub);
      const state = brandsReducer(initialBrandsState, action);

      expect(state.entities).toEqual(brandEntitiesStub);
      expect(state.loading).toEqual(false);
      expect(state.loaded).toEqual(true);
    });
  });

  describe('BrandsLoadFailAction', () => {
    it('should set loading to false', () => {
      const previousState = { ...initialBrandsState, loading: true };
      const action = new BrandsLoadFailAction({});
      const state = brandsReducer(previousState, action);

      expect(state.loading).toEqual(false);
    });
  });
});
