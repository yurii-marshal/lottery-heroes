import { SyndicatesActionTypes, SyndicatesLoadAction, SyndicatesLoadFailAction, SyndicatesLoadSuccessAction } from './syndicates.actions';

describe('Syndicates Actions', () => {
  describe('SyndicatesLoadAction', () => {
    it('should create an action', () => {
      const action = new SyndicatesLoadAction();

      expect({...action}).toEqual({
        type: SyndicatesActionTypes.SyndicatesLoadAction,
      });
    });
  });

  describe('SyndicatesLoadFailAction', () => {
    it('should create an action', () => {
      const payload = {message: 'Load Error'};
      const action = new SyndicatesLoadFailAction(payload);

      expect({...action}).toEqual({
        type: SyndicatesActionTypes.SyndicatesLoadFailAction,
        payload
      });
    });
  });

  describe('SyndicatesLoadSuccessAction', () => {
    it('should create an action', () => {
      const payload = [];
      const action = new SyndicatesLoadSuccessAction(payload);

      expect({...action}).toEqual({
        type: SyndicatesActionTypes.SyndicatesLoadSuccessAction,
        payload
      });
    });
  });
});
