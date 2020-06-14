import { BrandsActionTypes, BrandsLoadAction, BrandsLoadFailAction, BrandsLoadSuccessAction } from './brands.actions';

describe('Brands Actions', () => {
  describe('BrandsLoadAction', () => {
    it('should create an action', () => {
      const action = new BrandsLoadAction();

      expect({...action}).toEqual({
        type: BrandsActionTypes.BrandsLoadAction,
      });
    });
  });

  describe('BrandsLoadFailAction', () => {
    it('should create an action', () => {
      const payload = {message: 'Load Error'};
      const action = new BrandsLoadFailAction(payload);

      expect({...action}).toEqual({
        type: BrandsActionTypes.BrandsLoadFailAction,
        payload
      });
    });
  });

  describe('BrandsLoadSuccessAction', () => {
    it('should create an action', () => {
      const payload = [];
      const action = new BrandsLoadSuccessAction(payload);

      expect({...action}).toEqual({
        type: BrandsActionTypes.BrandsLoadSuccessAction,
        payload
      });
    });
  });
});
