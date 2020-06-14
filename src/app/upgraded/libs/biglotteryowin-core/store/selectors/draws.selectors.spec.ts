import { TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import {
  getDrawByDateLocalEntities,
  getDrawByDateLocalLoading,
  getDrawByIdEntities,
  getDrawByIdLoading,
  getDrawsState,
  getLatestDrawsEntities,
  getLatestDrawsLoaded,
  getLatestDrawsLoading,
  getUpcomingDrawsEntities,
  getUpcomingDrawsLoaded,
  getUpcomingDrawsLoading
} from './draws.selectors';
import { biglotteryowinCoreReducers, BiglotteryowinCoreState } from '../reducers';
import {
  DrawByDateLocalLoadAction,
  DrawByDateLocalLoadSuccessAction,
  DrawsByIdLoadAction,
  DrawsByIdLoadSuccessAction,
  LatestDrawsLoadAction,
  LatestDrawsLoadSuccessAction,
  UpcomingDrawsLoadAction,
  UpcomingDrawsLoadSuccessAction
} from '../actions/draws.actions';
import { drawEntitiesStub } from '../../stubs/draw-entities.stub';
import { drawByIdEntitiesStub } from '../../stubs/draw-by-id-entities.stub';
import { drawByDateLocalEntitiesStub } from '../../stubs/draw-by-date-local-entities.stub';

const drawsStub = require('@libs/biglotteryowin-api/stubs/lotteries/draws.stub.json');
const getSingleDrawStub = require('@libs/biglotteryowin-api/stubs/lotteries/get-single-draw.stub.json');

describe('Draws Selectors', () => {
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

  describe('getDrawsState', () => {
    it('should return state of draws store slice', () => {
      let result;

      store
        .select(getDrawsState)
        .subscribe(value => (result = value));

      expect(result).toEqual({
        upcomingEntities: {},
        upcomingLoading: false,
        upcomingLoaded: false,

        latestEntities: {},
        latestLoading: false,
        latestLoaded: false,

        drawByIdEntities: {},
        drawByIdLoading: false,

        drawByDateLocalEntities: {},
        drawByDateLocalLoading: false,
      });

      store.dispatch(new UpcomingDrawsLoadSuccessAction(drawsStub));
      store.dispatch(new LatestDrawsLoadSuccessAction(drawsStub));
      store.dispatch(new DrawsByIdLoadSuccessAction(drawsStub));
      store.dispatch(new DrawByDateLocalLoadSuccessAction(getSingleDrawStub));

      expect(result).toEqual({
        upcomingEntities: drawEntitiesStub,
        upcomingLoading: false,
        upcomingLoaded: true,

        latestEntities: drawEntitiesStub,
        latestLoading: false,
        latestLoaded: true,

        drawByIdEntities: drawByIdEntitiesStub,
        drawByIdLoading: false,

        drawByDateLocalEntities: drawByDateLocalEntitiesStub,
        drawByDateLocalLoading: false,
      });
    });
  });

  describe('getUpcomingDrawsEntities', () => {
    it('should return upcoming draws as entities', () => {
      let result;

      store
        .select(getUpcomingDrawsEntities)
        .subscribe(value => (result = value));

      expect(result).toEqual({});

      store.dispatch(new UpcomingDrawsLoadSuccessAction(drawsStub));

      expect(result).toEqual(drawEntitiesStub);
    });
  });

  describe('getUpcomingDrawsLoading', () => {
    it('should return upcoming draws loading state', () => {
      let result;

      store
        .select(getUpcomingDrawsLoading)
        .subscribe(value => (result = value));

      expect(result).toEqual(false);

      store.dispatch(new UpcomingDrawsLoadAction());

      expect(result).toEqual(true);
    });
  });

  describe('getUpcomingDrawsLoaded', () => {
    it('should return upcoming draws loaded state', () => {
      let result;

      store
        .select(getUpcomingDrawsLoaded)
        .subscribe(value => (result = value));

      expect(result).toEqual(false);

      store.dispatch(new UpcomingDrawsLoadSuccessAction([]));

      expect(result).toEqual(true);
    });
  });


  describe('getLatestDrawsEntities', () => {
    it('should return latest draws as entities', () => {
      let result;

      store
        .select(getLatestDrawsEntities)
        .subscribe(value => (result = value));

      expect(result).toEqual({});

      store.dispatch(new LatestDrawsLoadSuccessAction(drawsStub));

      expect(result).toEqual(drawEntitiesStub);
    });
  });

  describe('getLatestDrawsLoading', () => {
    it('should return latest draws loading state', () => {
      let result;

      store
        .select(getLatestDrawsLoading)
        .subscribe(value => (result = value));

      expect(result).toEqual(false);

      store.dispatch(new LatestDrawsLoadAction());

      expect(result).toEqual(true);
    });
  });

  describe('getLatestDrawsLoaded', () => {
    it('should return latest draws loaded state', () => {
      let result;

      store
        .select(getLatestDrawsLoaded)
        .subscribe(value => (result = value));

      expect(result).toEqual(false);

      store.dispatch(new LatestDrawsLoadSuccessAction([]));

      expect(result).toEqual(true);
    });
  });

  describe('getDrawByIdEntities', () => {
    it('should return draw by id entities', () => {
      let result;

      store
        .select(getDrawByIdEntities)
        .subscribe(value => (result = value));

      expect(result).toEqual({});

      store.dispatch(new DrawsByIdLoadSuccessAction(drawsStub));

      expect(result).toEqual(drawByIdEntitiesStub);
    });
  });

  describe('getDrawByIdLoading', () => {
    it('should return draw by id loading state', () => {
      let result;

      store
        .select(getDrawByIdLoading)
        .subscribe(value => (result = value));

      expect(result).toEqual(false);

      store.dispatch(new DrawsByIdLoadAction([222, 333]));

      expect(result).toEqual(true);
    });
  });

  describe('getDrawByDateLocalEntities', () => {
    it('should return draw by date local entities', () => {
      let result;

      store
        .select(getDrawByDateLocalEntities)
        .subscribe(value => (result = value));

      expect(result).toEqual({});

      store.dispatch(new DrawByDateLocalLoadSuccessAction(getSingleDrawStub));

      expect(result).toEqual(drawByDateLocalEntitiesStub);
    });
  });

  describe('getDrawByDateLocalLoading', () => {
    it('should return draw by date local loading state', () => {
      let result;

      store
        .select(getDrawByDateLocalLoading)
        .subscribe(value => (result = value));

      expect(result).toEqual(false);

      store.dispatch(new DrawByDateLocalLoadAction({lotteryId: 'powerball', dateLocal: '2018-03-28'}));

      expect(result).toEqual(true);
    });
  });
});
