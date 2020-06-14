import { drawsReducer, initialDrawsState } from './draws.reducer';
import {
  DrawByDateLocalLoadAction,
  DrawByDateLocalLoadFailAction,
  DrawByDateLocalLoadSuccessAction,
  DrawsByIdLoadAction, DrawsByIdLoadFailAction, DrawsByIdLoadSuccessAction,
  LatestDrawsLoadAction,
  LatestDrawsLoadFailAction,
  LatestDrawsLoadSuccessAction,
  UpcomingDrawsLoadAction,
  UpcomingDrawsLoadFailAction,
  UpcomingDrawsLoadSuccessAction
} from '../actions/draws.actions';
import { drawEntitiesStub } from '../../stubs/draw-entities.stub';

const drawsStub = require('@libs/biglotteryowin-api/stubs/lotteries/draws.stub.json');

describe('drawsReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = drawsReducer(undefined, action);

      expect(state).toBe(initialDrawsState);
    });
  });

  /*********************************************************************************
   * UPCOMING
   *********************************************************************************/
  describe('UpcomingDrawsLoadAction', () => {
    it('should set loading to true', () => {
      const action = new UpcomingDrawsLoadAction();
      const state = drawsReducer(initialDrawsState, action);

      expect(state.upcomingLoading).toEqual(true);
    });
  });

  describe('UpcomingDrawsLoadSuccessAction', () => {
    it('should populate upcoming entities', () => {
      const action = new UpcomingDrawsLoadSuccessAction(drawsStub as any);
      const state = drawsReducer(initialDrawsState, action);

      expect(state.upcomingEntities).toEqual(drawEntitiesStub as any);
      expect(state.upcomingLoading).toEqual(false);
      expect(state.upcomingLoaded).toEqual(true);
    });
  });

  describe('UpcomingDrawsLoadFailAction', () => {
    it('should set upcomingLoading to false', () => {
      const previousState = { ...initialDrawsState, upcomingLoading: true };
      const action = new UpcomingDrawsLoadFailAction({});
      const state = drawsReducer(previousState, action);

      expect(state.upcomingLoading).toEqual(false);
    });
  });

  /*********************************************************************************
   * LATEST
   *********************************************************************************/
  describe('LatestDrawsLoadAction', () => {
    it('should set loading to true', () => {
      const action = new LatestDrawsLoadAction();
      const state = drawsReducer(initialDrawsState, action);

      expect(state.latestLoading).toEqual(true);
    });
  });

  describe('LatestDrawsLoadSuccessAction', () => {
    it('should populate latest entities', () => {
      const action = new LatestDrawsLoadSuccessAction(drawsStub as any);
      const state = drawsReducer(initialDrawsState, action);

      expect(state.latestEntities).toEqual(drawEntitiesStub as any);
      expect(state.latestLoading).toEqual(false);
      expect(state.latestLoaded).toEqual(true);
    });
  });

  describe('LatestDrawsLoadFailAction', () => {
    it('should set latestLoading to false', () => {
      const previousState = { ...initialDrawsState, latestLoading: true };
      const action = new LatestDrawsLoadFailAction({});
      const state = drawsReducer(previousState, action);

      expect(state.latestLoading).toEqual(false);
    });
  });

  /*********************************************************************************
   * DRAWS BY ID
   *********************************************************************************/
  describe('DrawsByIdLoadAction', () => {
    it('should set drawByIdLoading to true', () => {
      const action = new DrawsByIdLoadAction([333, 444]);
      const state = drawsReducer(initialDrawsState, action);

      expect(state.drawByIdLoading).toEqual(true);
    });
  });

  describe('DrawsByIdLoadSuccessAction', () => {
    it('should ad draws by id entities', () => {
      const previousState = { ...initialDrawsState, drawByIdLoading: true };

      let action = new DrawsByIdLoadSuccessAction([{
        id: 1,
        lottery_id: 'powerball',
        jackpot: 1,
        min_jackpot: 1,
        date_local: '2018-03-28',
        last_ticket_time: '2018-03-29T03:00:00.000Z',
      } as any]);
      let state = drawsReducer(previousState, action);

      expect(state.drawByIdEntities).toEqual({
        '1': {
          drawId: 1,
          lotteryId: 'powerball',
          jackpot: 1,
          minJackpot: 1,
          dateLocal: '2018-03-28',
          lastTicketTime: '2018-03-29T03:00:00.000Z',
        }
      } as any);

      action = new DrawsByIdLoadSuccessAction([{
        id: 2,
        lottery_id: 'powerball',
        jackpot: 2,
        min_jackpot: 2,
        date_local: '2018-03-29',
        last_ticket_time: '2018-03-29T03:00:00.000Z',
      } as any]);
      state = drawsReducer(state, action);

      expect(state.drawByIdEntities).toEqual({
        '1': {
          drawId: 1,
          lotteryId: 'powerball',
          jackpot: 1,
          minJackpot: 1,
          dateLocal: '2018-03-28',
          lastTicketTime: '2018-03-29T03:00:00.000Z',
        },
        '2': {
          drawId: 2,
          lotteryId: 'powerball',
          jackpot: 2,
          minJackpot: 2,
          dateLocal: '2018-03-29',
          lastTicketTime: '2018-03-29T03:00:00.000Z',
        }
      } as any);

      action = new DrawsByIdLoadSuccessAction([{
        id: 1,
        lottery_id: 'el-gordo',
        jackpot: 3,
        min_jackpot: 3,
        date_local: '2018-03-30',
        last_ticket_time: '2018-03-29T03:00:00.000Z',
      } as any]);
      state = drawsReducer(state, action);

      expect(state.drawByIdEntities).toEqual({
        '1': {
          drawId: 1,
          lotteryId: 'el-gordo',
          jackpot: 3,
          minJackpot: 3,
          dateLocal: '2018-03-30',
          lastTicketTime: '2018-03-29T03:00:00.000Z',
        },
        '2': {
          drawId: 2,
          lotteryId: 'powerball',
          jackpot: 2,
          minJackpot: 2,
          dateLocal: '2018-03-29',
          lastTicketTime: '2018-03-29T03:00:00.000Z',
        }
      } as any);

      expect(state.drawByIdLoading).toEqual(false);
    });
  });

  describe('DrawsByIdLoadFailAction', () => {
    it('should set drawByIdLoading to false', () => {
      const previousState = { ...initialDrawsState, drawByIdLoading: true };
      const action = new DrawsByIdLoadFailAction({});
      const state = drawsReducer(previousState, action);

      expect(state.drawByIdLoading).toEqual(false);
    });
  });

  /*********************************************************************************
   * DRAW BY DATE LOCAL
   *********************************************************************************/
  describe('DrawByDateLocalLoadAction', () => {
    it('should set drawByDateLocalLoading to true', () => {
      const action = new DrawByDateLocalLoadAction({lotteryId: 'powerball', dateLocal: '2018-03-28'});
      const state = drawsReducer(initialDrawsState, action);

      expect(state.drawByDateLocalLoading).toEqual(true);
    });
  });

  describe('DrawByDateLocalLoadSuccessAction', () => {
    it('should ad draw by date local entity', () => {
      const previousState = { ...initialDrawsState, drawByDateLocalLoading: true };

      let action = new DrawByDateLocalLoadSuccessAction({
        id: 1,
        lottery_id: 'powerball',
        jackpot: 1,
        min_jackpot: 1,
        date_local: '2018-03-28',
        last_ticket_time: '2018-03-29T03:00:00.000Z',
      } as any);
      let state = drawsReducer(previousState, action);

      expect(state.drawByDateLocalEntities).toEqual({
        'powerball_2018-03-28': {
          drawId: 1,
          lotteryId: 'powerball',
          jackpot: 1,
          minJackpot: 1,
          dateLocal: '2018-03-28',
          lastTicketTime: '2018-03-29T03:00:00.000Z',
        }
      } as any);

      action = new DrawByDateLocalLoadSuccessAction({
        id: 2,
        lottery_id: 'powerball',
        jackpot: 2,
        min_jackpot: 2,
        date_local: '2018-03-29',
        last_ticket_time: '2018-03-29T03:00:00.000Z',
      } as any);
      state = drawsReducer(state, action);

      expect(state.drawByDateLocalEntities).toEqual({
        'powerball_2018-03-28': {
          drawId: 1,
          lotteryId: 'powerball',
          jackpot: 1,
          minJackpot: 1,
          dateLocal: '2018-03-28',
          lastTicketTime: '2018-03-29T03:00:00.000Z',
        },
        'powerball_2018-03-29': {
          drawId: 2,
          lotteryId: 'powerball',
          jackpot: 2,
          minJackpot: 2,
          dateLocal: '2018-03-29',
          lastTicketTime: '2018-03-29T03:00:00.000Z',
        }
      } as any);

      action = new DrawByDateLocalLoadSuccessAction({
        id: 3,
        lottery_id: 'powerball',
        jackpot: 3,
        min_jackpot: 3,
        date_local: '2018-03-28',
        last_ticket_time: '2018-03-29T03:00:00.000Z',
      } as any);
      state = drawsReducer(state, action);

      expect(state.drawByDateLocalEntities).toEqual({
        'powerball_2018-03-28': {
          drawId: 3,
          lotteryId: 'powerball',
          jackpot: 3,
          minJackpot: 3,
          dateLocal: '2018-03-28',
          lastTicketTime: '2018-03-29T03:00:00.000Z',
        },
        'powerball_2018-03-29': {
          drawId: 2,
          lotteryId: 'powerball',
          jackpot: 2,
          minJackpot: 2,
          dateLocal: '2018-03-29',
          lastTicketTime: '2018-03-29T03:00:00.000Z',
        }
      } as any);

      expect(state.drawByDateLocalLoading).toEqual(false);
    });
  });

  describe('DrawByDateLocalLoadFailAction', () => {
    it('should set drawByDateLocalLoading to false', () => {
      const previousState = { ...initialDrawsState, drawByDateLocalLoading: true };
      const action = new DrawByDateLocalLoadFailAction({});
      const state = drawsReducer(previousState, action);

      expect(state.drawByDateLocalLoading).toEqual(false);
    });
  });
});
