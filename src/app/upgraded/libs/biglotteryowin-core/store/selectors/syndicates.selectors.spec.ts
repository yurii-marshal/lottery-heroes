import { TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { biglotteryowinCoreReducers, BiglotteryowinCoreState } from '../reducers';
import {
  getSyndicatesEntities, getSyndicatesLoaded, getSyndicatesLoading,
  getSyndicatesState
} from '../selectors/syndicates.selectors';
import { SyndicatesLoadAction, SyndicatesLoadSuccessAction } from '../actions/syndicates.actions';
import { syndicateEntitiesStub } from '../../stubs/syndicate-entities.stub';

const syndicatesStub = require('@libs/biglotteryowin-api/stubs/offerings/syndicates.stub.json');

describe('Syndicates Selectors', () => {
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

  describe('getSyndicatesState', () => {
    it('should return state of syndicates store slice', () => {
      let result;

      store
        .select(getSyndicatesState)
        .subscribe(value => (result = value));

      expect(result).toEqual({
        entities: {},
        loading: false,
        loaded: false,
      });

      store.dispatch(new SyndicatesLoadSuccessAction(syndicatesStub));

      expect(result).toEqual({
        entities: syndicateEntitiesStub,
        loading: false,
        loaded: true,
      });
    });
  });

  describe('getSyndicatesEntities', () => {
    it('should return syndicates as entities', () => {
      let result;

      store
        .select(getSyndicatesEntities)
        .subscribe(value => (result = value));

      expect(result).toEqual({});

      store.dispatch(new SyndicatesLoadSuccessAction(syndicatesStub));

      expect(result).toEqual(syndicateEntitiesStub);
    });
  });

  describe('getBrandsLoading', () => {
    it('should return syndicates loading state', () => {
      let result;

      store
        .select(getSyndicatesLoading)
        .subscribe(value => (result = value));

      expect(result).toEqual(false);

      store.dispatch(new SyndicatesLoadAction());

      expect(result).toEqual(true);
    });
  });

  describe('getSyndicatesLoaded', () => {
    it('should return syndicates loaded state', () => {
      let result;

      store
        .select(getSyndicatesLoaded)
        .subscribe(value => (result = value));

      expect(result).toEqual(false);

      store.dispatch(new SyndicatesLoadSuccessAction([]));

      expect(result).toEqual(true);
    });
  });
});
