import {
  OffersActionTypes, OffersLoadAction, OffersLoadFailAction,
  OffersLoadSuccessAction
} from './offers.actions';

describe('Offers Actions', () => {
  describe('OffersLoadAction', () => {
    it('should create an action', () => {
      const action = new OffersLoadAction();

      expect({...action}).toEqual({
        type: OffersActionTypes.OffersLoadAction,
      });
    });
  });

  describe('OffersLoadFailAction', () => {
    it('should create an action', () => {
      const payload = {message: 'Load Error'};
      const action = new OffersLoadFailAction(payload);

      expect({...action}).toEqual({
        type: OffersActionTypes.OffersLoadFailAction,
        payload
      });
    });
  });

  describe('OffersLoadSuccessAction', () => {
    it('should create an action', () => {
      const payload = {};
      const action = new OffersLoadSuccessAction(payload);

      expect({...action}).toEqual({
        type: OffersActionTypes.OffersLoadSuccessAction,
        payload
      });
    });
  });
});
