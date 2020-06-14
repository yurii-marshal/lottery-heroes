import { LotteriesActionTypes, LotteriesLoadAction, LotteriesLoadFailAction, LotteriesLoadSuccessAction } from './lotteries.actions';

describe('Lotteries Actions', () => {
  describe('LotteriesLoadAction', () => {
    it('should create an action', () => {
      const action = new LotteriesLoadAction();

      expect({...action}).toEqual({
        type: LotteriesActionTypes.LotteriesLoadAction,
      });
    });
  });

  describe('LotteriesLoadFailAction', () => {
    it('should create an action', () => {
      const payload = {message: 'Load Error'};
      const action = new LotteriesLoadFailAction(payload);

      expect({...action}).toEqual({
        type: LotteriesActionTypes.LotteriesLoadFailAction,
        payload
      });
    });
  });

  describe('LotteriesLoadSuccessAction', () => {
    it('should create an action', () => {
      const payload = [];
      const action = new LotteriesLoadSuccessAction(payload);

      expect({...action}).toEqual({
        type: LotteriesActionTypes.LotteriesLoadSuccessAction,
        payload
      });
    });
  });
});
