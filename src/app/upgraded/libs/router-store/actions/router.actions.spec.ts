import { RouterActionTypes, RouterBackAction, RouterForwardAction, RouterGoAction } from './router.actions';

describe('Router Actions', () => {
  describe('RouterGoAction', () => {
    it('should create an action', () => {
      const payload = {
        path: ['/heroes', {id: 1, foo: 'foo'}],
        queryParams: {'session_id': 'something'}
      };
      const action = new RouterGoAction(payload);

      expect({...action}).toEqual({
        type: RouterActionTypes.RouterGoAction,
        payload
      });
    });
  });

  describe('RouterBackAction', () => {
    it('should create an action', () => {
      const action = new RouterBackAction();

      expect({...action}).toEqual({
        type: RouterActionTypes.RouterBackAction
      });
    });
  });

  describe('RouterForwardAction', () => {
    it('should create an action', () => {
      const action = new RouterForwardAction();

      expect({...action}).toEqual({
        type: RouterActionTypes.RouterForwardAction
      });
    });
  });
});
