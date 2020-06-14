import { TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { biglotteryowinCoreReducers, BiglotteryowinCoreState } from '../reducers';
import { getPricesEntities, getPricesLoaded, getPricesLoading, getPricesState } from './prices.selectors';
import { PricesLoadAction, PricesLoadSuccessAction } from '../actions/prices.actions';
import { pricesEntitiesStub } from '../../stubs/prices-entities.stub';

const pricesStub = require('@libs/biglotteryowin-api/stubs/offerings/prices.stub.json');

describe('Prices Selectors', () => {
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

  describe('getPricesState', () => {
    it('should return state of prices store slice', () => {
      let result;

      store
        .select(getPricesState)
        .subscribe(value => (result = value));

      expect(result).toEqual({
        entities: {},
        loading: false,
        loaded: false,
      });

      store.dispatch(new PricesLoadSuccessAction(pricesStub));

      expect(result).toEqual({
        entities: pricesEntitiesStub,
        loading: false,
        loaded: true,
      });
    });
  });

  describe('getPricesEntities', () => {
    it('should return prices as entities', () => {
      let result;

      store
        .select(getPricesEntities)
        .subscribe(value => (result = value));

      expect(result).toEqual({});

      store.dispatch(new PricesLoadSuccessAction(pricesStub));

      expect(result).toEqual(pricesEntitiesStub);
    });
  });

  describe('getPricesLoading', () => {
    it('should return prices loading state', () => {
      let result;

      store
        .select(getPricesLoading)
        .subscribe(value => (result = value));

      expect(result).toEqual(false);

      store.dispatch(new PricesLoadAction());

      expect(result).toEqual(true);
    });
  });

  describe('getPricesLoaded', () => {
    it('should return prices loaded state', () => {
      let result;

      store
        .select(getPricesLoaded)
        .subscribe(value => (result = value));

      expect(result).toEqual(false);

      store.dispatch(new PricesLoadSuccessAction({}));

      expect(result).toEqual(true);
    });
  });
});
