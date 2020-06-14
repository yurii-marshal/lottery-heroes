import {
  PricesActionTypes, PricesLoadAction, PricesLoadFailAction,
  PricesLoadSuccessAction
} from './prices.actions';

describe('Prices Actions', () => {
  describe('PricesLoadAction', () => {
    it('should create an action', () => {
      const action = new PricesLoadAction();

      expect({...action}).toEqual({
        type: PricesActionTypes.PricesLoadAction,
      });
    });
  });

  describe('PricesLoadFailAction', () => {
    it('should create an action', () => {
      const payload = {message: 'Load Error'};
      const action = new PricesLoadFailAction(payload);

      expect({...action}).toEqual({
        type: PricesActionTypes.PricesLoadFailAction,
        payload
      });
    });
  });

  describe('PricesLoadSuccessAction', () => {
    it('should create an action', () => {
      const payload = {};
      const action = new PricesLoadSuccessAction(payload);

      expect({...action}).toEqual({
        type: PricesActionTypes.PricesLoadSuccessAction,
        payload
      });
    });
  });
});
