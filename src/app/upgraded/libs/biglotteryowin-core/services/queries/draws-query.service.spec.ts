import { TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { DrawsQueryService } from './draws-query.service';
import { biglotteryowinCoreReducers, BiglotteryowinCoreState } from '../../store/reducers';
import { DrawByDateLocalLoadAction, DrawByDateLocalLoadSuccessAction } from '../../store/actions/draws.actions';

const getSingleDrawStub = require('@libs/biglotteryowin-api/stubs/lotteries/get-single-draw.stub.json');

describe('DrawsQueryService', () => {
  let service: DrawsQueryService;
  let store: Store<BiglotteryowinCoreState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          'BiglotteryowinCore': combineReducers(biglotteryowinCoreReducers)
        }),
      ],
      providers: [
        DrawsQueryService,
      ]
    });

    service = TestBed.get(DrawsQueryService);
    store = TestBed.get(Store);
  });

  describe('getDrawByDateLocal', () => {
    it('should dispatch load action if not loaded and wait', () => {
      const spyStoreDispatch = spyOn(store, 'dispatch').and.callThrough();

      service.getDrawByDateLocal('powerball', '2018-03-28').subscribe((data) => {
        fail('Subscription has been called');
      });

      expect(spyStoreDispatch).toHaveBeenCalledTimes(1);
      expect(spyStoreDispatch).toHaveBeenCalledWith(new DrawByDateLocalLoadAction({lotteryId: 'powerball', dateLocal: '2018-03-28'}));
    });

    it('should not dispatch load actions if loaded', () => {
      const spyStoreDispatch = spyOn(store, 'dispatch').and.callThrough();

      store.dispatch(new DrawByDateLocalLoadSuccessAction(getSingleDrawStub));

      expect(spyStoreDispatch).toHaveBeenCalledTimes(1);
    });

    it('should replay last value', () => {
      const spyStoreSelect = spyOn(store, 'select').and.callThrough();

      store.dispatch(new DrawByDateLocalLoadSuccessAction(getSingleDrawStub));

      const drawByDateLocal$ = service.getDrawByDateLocal('powerball', '2018-03-28');
      drawByDateLocal$.subscribe();
      drawByDateLocal$.subscribe();

      expect(spyStoreSelect).toHaveBeenCalledTimes(1);
    });
  });
});
