import {
  DrawByDateLocalLoadAction,
  DrawByDateLocalLoadFailAction,
  DrawByDateLocalLoadSuccessAction,
  DrawsActionTypes,
  DrawsByIdLoadAction,
  DrawsByIdLoadFailAction,
  DrawsByIdLoadSuccessAction,
  LatestDrawsLoadAction,
  LatestDrawsLoadFailAction,
  LatestDrawsLoadSuccessAction,
  UpcomingDrawsLoadAction,
  UpcomingDrawsLoadFailAction,
  UpcomingDrawsLoadSuccessAction
} from './draws.actions';

const getSingleDrawStub = require('@libs/biglotteryowin-api/stubs/lotteries/get-single-draw.stub.json');

describe('Draws Actions', () => {
  describe('UpcomingDrawsLoadAction', () => {
    it('should create an action', () => {
      const action = new UpcomingDrawsLoadAction();

      expect({...action}).toEqual({
        type: DrawsActionTypes.UpcomingDrawsLoadAction,
      });
    });
  });

  describe('UpcomingDrawsLoadFailAction', () => {
    it('should create an action', () => {
      const payload = {message: 'Load Error'};
      const action = new UpcomingDrawsLoadFailAction(payload);

      expect({...action}).toEqual({
        type: DrawsActionTypes.UpcomingDrawsLoadFailAction,
        payload
      });
    });
  });

  describe('UpcomingDrawsLoadSuccessAction', () => {
    it('should create an action', () => {
      const payload = [];
      const action = new UpcomingDrawsLoadSuccessAction(payload);

      expect({...action}).toEqual({
        type: DrawsActionTypes.UpcomingDrawsLoadSuccessAction,
        payload
      });
    });
  });

  describe('LatestDrawsLoadAction', () => {
    it('should create an action', () => {
      const action = new LatestDrawsLoadAction();

      expect({...action}).toEqual({
        type: DrawsActionTypes.LatestDrawsLoadAction,
      });
    });
  });

  describe('LatestDrawsLoadFailAction', () => {
    it('should create an action', () => {
      const payload = {message: 'Load Error'};
      const action = new LatestDrawsLoadFailAction(payload);

      expect({...action}).toEqual({
        type: DrawsActionTypes.LatestDrawsLoadFailAction,
        payload
      });
    });
  });

  describe('LatestDrawsLoadSuccessAction', () => {
    it('should create an action', () => {
      const payload = [];
      const action = new LatestDrawsLoadSuccessAction(payload);

      expect({...action}).toEqual({
        type: DrawsActionTypes.LatestDrawsLoadSuccessAction,
        payload
      });
    });
  });

  describe('DrawsByIdLoadAction', () => {
    it('should create an action', () => {
      const payload = [777, 999];
      const action = new DrawsByIdLoadAction(payload);

      expect({...action}).toEqual({
        type: DrawsActionTypes.DrawsByIdLoadAction,
        payload
      });
    });
  });

  describe('DrawsByIdLoadFailAction', () => {
    it('should create an action', () => {
      const payload = {message: 'Load Error'};
      const action = new DrawsByIdLoadFailAction(payload);

      expect({...action}).toEqual({
        type: DrawsActionTypes.DrawsByIdLoadFailAction,
        payload
      });
    });
  });

  describe('DrawsByIdLoadSuccessAction', () => {
    it('should create an action', () => {
      const payload = [];
      const action = new DrawsByIdLoadSuccessAction(payload);

      expect({...action}).toEqual({
        type: DrawsActionTypes.DrawsByIdLoadSuccessAction,
        payload
      });
    });
  });

  describe('DrawByDateLocalLoadAction', () => {
    it('should create an action', () => {
      const payload = {lotteryId: 'powerball', dateLocal: '2018-03-28'};
      const action = new DrawByDateLocalLoadAction(payload);

      expect({...action}).toEqual({
        type: DrawsActionTypes.DrawByDateLocalLoadAction,
        payload
      });
    });
  });

  describe('DrawByDateLocalLoadFailAction', () => {
    it('should create an action', () => {
      const payload = {message: 'Load Error'};
      const action = new DrawByDateLocalLoadFailAction(payload);

      expect({...action}).toEqual({
        type: DrawsActionTypes.DrawByDateLocalLoadFailAction,
        payload
      });
    });
  });

  describe('DrawByDateLocalLoadSuccessAction', () => {
    it('should create an action', () => {
      const payload = getSingleDrawStub;
      const action = new DrawByDateLocalLoadSuccessAction(payload);

      expect({...action}).toEqual({
        type: DrawsActionTypes.DrawByDateLocalLoadSuccessAction,
        payload
      });
    });
  });
});
