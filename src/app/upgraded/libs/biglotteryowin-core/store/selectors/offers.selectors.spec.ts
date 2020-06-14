import { TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { biglotteryowinCoreReducers, BiglotteryowinCoreState } from '../reducers';
import { getOffersEntities, getOffersLoaded, getOffersLoading, getOffersState } from '../selectors/offers.selectors';
import { OffersLoadAction, OffersLoadSuccessAction } from '../actions/offers.actions';
import { offersEntitiesStub } from '../../stubs/offers-entities.stub';

const offersStub = require('@libs/biglotteryowin-api/stubs/offerings/offers.stub.json');

describe('Offers Selectors', () => {
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

  describe('getOffersState', () => {
    it('should return state of offers store slice', () => {
      let result;

      store
        .select(getOffersState)
        .subscribe(value => (result = value));

      expect(result).toEqual({
        entities: {},
        loading: false,
        loaded: false,
      });

      store.dispatch(new OffersLoadSuccessAction(offersStub));

      expect(result).toEqual({
        entities: offersEntitiesStub,
        loading: false,
        loaded: true,
      });
    });
  });

  describe('getOffersEntities', () => {
    it('should return offers as entities', () => {
      let result;

      store
        .select(getOffersEntities)
        .subscribe(value => (result = value));

      expect(result).toEqual({});

      store.dispatch(new OffersLoadSuccessAction(offersStub));

      expect(result).toEqual(offersEntitiesStub);
    });
  });

  describe('getOffersLoading', () => {
    it('should return offers loading state', () => {
      let result;

      store
        .select(getOffersLoading)
        .subscribe(value => (result = value));

      expect(result).toEqual(false);

      store.dispatch(new OffersLoadAction());

      expect(result).toEqual(true);
    });
  });

  describe('getOffersLoaded', () => {
    it('should return offers loaded state', () => {
      let result;

      store
        .select(getOffersLoaded)
        .subscribe(value => (result = value));

      expect(result).toEqual(false);

      store.dispatch(new OffersLoadSuccessAction({}));

      expect(result).toEqual(true);
    });
  });
});
