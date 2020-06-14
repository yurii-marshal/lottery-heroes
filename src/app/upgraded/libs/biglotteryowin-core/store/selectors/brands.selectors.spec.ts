import { TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { getBrandsEntities, getBrandsLoaded, getBrandsLoading, getBrandsState } from './brands.selectors';
import { biglotteryowinCoreReducers, BiglotteryowinCoreState } from '../reducers';
import { BrandsLoadAction, BrandsLoadSuccessAction } from '../actions/brands.actions';
import { brandEntitiesStub } from '../../stubs/brand-entities.stub';

const brandsStub = require('@libs/biglotteryowin-api/stubs/luv/brands.stub.json');

describe('Brands Selectors', () => {
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

  describe('getBrandsState', () => {
    it('should return state of brands store slice', () => {
      let result;

      store
        .select(getBrandsState)
        .subscribe(value => (result = value));

      expect(result).toEqual({
        entities: {},
        loading: false,
        loaded: false,
      });

      store.dispatch(new BrandsLoadSuccessAction(brandsStub));

      expect(result).toEqual({
        entities: brandEntitiesStub,
        loading: false,
        loaded: true,
      });
    });
  });

  describe('getBrandsEntities', () => {
    it('should return brands as entities', () => {
      let result;

      store
        .select(getBrandsEntities)
        .subscribe(value => (result = value));

      expect(result).toEqual({});

      store.dispatch(new BrandsLoadSuccessAction(brandsStub));

      expect(result).toEqual(brandEntitiesStub);
    });
  });

  describe('getBrandsLoading', () => {
    it('should return brands loading state', () => {
      let result;

      store
        .select(getBrandsLoading)
        .subscribe(value => (result = value));

      expect(result).toEqual(false);

      store.dispatch(new BrandsLoadAction());

      expect(result).toEqual(true);
    });
  });

  describe('getBrandsLoaded', () => {
    it('should return brands loaded state', () => {
      let result;

      store
        .select(getBrandsLoaded)
        .subscribe(value => (result = value));

      expect(result).toEqual(false);

      store.dispatch(new BrandsLoadSuccessAction([]));

      expect(result).toEqual(true);
    });
  });
});
