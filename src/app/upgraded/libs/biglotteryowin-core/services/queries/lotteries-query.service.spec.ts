import { TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs/observable/of';

import { RequestQueryService } from '@libs/environment/services/queries/request-query.service';

import { BrandQueryService } from './brand-query.service';
import { CurrencyQueryService } from './currency-query.service';
import { QaQueryService } from './qa-query.service';
import { LotteriesQueryService } from './lotteries-query.service';
import { biglotteryowinCoreReducers, BiglotteryowinCoreState } from '../../store/reducers';
import { LotteriesLoadAction, LotteriesLoadSuccessAction } from '../../store/actions/lotteries.actions';
import {
  LatestDrawsLoadAction,
  LatestDrawsLoadSuccessAction,
  UpcomingDrawsLoadAction,
  UpcomingDrawsLoadSuccessAction
} from '../../store/actions/draws.actions';
import { PricesLoadAction, PricesLoadSuccessAction } from '../../store/actions/prices.actions';
import { OffersLoadAction, OffersLoadSuccessAction } from '../../store/actions/offers.actions';
import { LotteryModel } from '../../models/lottery.model';
import { lotteryEntitiesStub } from '../../stubs/lottery-entities.stub';
import { drawEntitiesStub } from '../../stubs/draw-entities.stub';
import { pricesEntitiesStub } from '../../stubs/prices-entities.stub';
import { offersEntitiesStub } from '../../stubs/offers-entities.stub';

const lotteriesStub = require('@libs/biglotteryowin-api/stubs/lotteries/lotteries.stub.json');
const drawsStub = require('@libs/biglotteryowin-api/stubs/lotteries/draws.stub.json');
const pricesStub = require('@libs/biglotteryowin-api/stubs/offerings/prices.stub.json');
const offersStub = require('@libs/biglotteryowin-api/stubs/offerings/offers.stub.json');

describe('LotteriesQueryService', () => {
  let service: LotteriesQueryService;
  let store: Store<BiglotteryowinCoreState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          'BiglotteryowinCore': combineReducers(biglotteryowinCoreReducers)
        }),
      ],
      providers: [
        {
          provide: RequestQueryService,
          useValue: jasmine.createSpyObj<RequestQueryService>('RequestQueryService', {
            getLocationOrigin: 'https://www.biglotteryowin.com'
          })
        },
        {
          provide: BrandQueryService,
          useValue: jasmine.createSpyObj<BrandQueryService>('BrandQueryService', {
            getBrandId: 'BIGLOTTERYOWIN_COM'
          })
        },
        {
          provide: CurrencyQueryService,
          useValue: jasmine.createSpyObj<CurrencyQueryService>('CurrencyQueryService', {
            getSiteCurrencyId: of('GBP')
          })
        },
        {
          provide: QaQueryService,
          useValue: jasmine.createSpyObj<QaQueryService>('QaQueryService', {
            getNullJackpotIds: of([])
          })
        },
        LotteriesQueryService,
      ]
    });

    service = TestBed.get(LotteriesQueryService);
    store = TestBed.get(Store);
  });

  describe('getLotteryModelsMap', () => {
    it('should dispatch load actions if not loaded and wait', () => {
      const spyStoreDispatch = spyOn(store, 'dispatch').and.callThrough();

      service.getLotteryModelsMap().subscribe((data) => {
        fail('Subscription has been called');
      });

      expect(spyStoreDispatch).toHaveBeenCalledTimes(5);
      expect(spyStoreDispatch).toHaveBeenCalledWith(new LotteriesLoadAction());
      expect(spyStoreDispatch).toHaveBeenCalledWith(new UpcomingDrawsLoadAction());
      expect(spyStoreDispatch).toHaveBeenCalledWith(new LatestDrawsLoadAction());
      expect(spyStoreDispatch).toHaveBeenCalledWith(new PricesLoadAction());
      expect(spyStoreDispatch).toHaveBeenCalledWith(new OffersLoadAction());
    });

    it('should not dispatch load actions if loaded', () => {
      const spyStoreDispatch = spyOn(store, 'dispatch').and.callThrough();

      store.dispatch(new LotteriesLoadSuccessAction(lotteriesStub));
      store.dispatch(new UpcomingDrawsLoadSuccessAction(drawsStub));
      store.dispatch(new LatestDrawsLoadSuccessAction(drawsStub));
      store.dispatch(new PricesLoadSuccessAction(pricesStub));
      store.dispatch(new OffersLoadSuccessAction(offersStub));

      expect(spyStoreDispatch).toHaveBeenCalledTimes(5);
      expect(spyStoreDispatch).not.toHaveBeenCalledWith(new LotteriesLoadAction());
      expect(spyStoreDispatch).not.toHaveBeenCalledWith(new UpcomingDrawsLoadAction());
      expect(spyStoreDispatch).not.toHaveBeenCalledWith(new LatestDrawsLoadAction());
      expect(spyStoreDispatch).not.toHaveBeenCalledWith(new PricesLoadAction());
      expect(spyStoreDispatch).not.toHaveBeenCalledWith(new OffersLoadAction());
    });

    it('should not create models if no upcoming draws', () => {
      store.dispatch(new LotteriesLoadSuccessAction(lotteriesStub));
      store.dispatch(new LatestDrawsLoadSuccessAction(drawsStub));
      store.dispatch(new PricesLoadSuccessAction(pricesStub));
      store.dispatch(new OffersLoadSuccessAction(offersStub));

      service.getLotteryModelsMap().subscribe((models) => {
        expect(models).toEqual({});
      });
    });

    it('should not create models if no latest draws', () => {
      store.dispatch(new LotteriesLoadSuccessAction(lotteriesStub));
      store.dispatch(new UpcomingDrawsLoadSuccessAction(drawsStub));
      store.dispatch(new PricesLoadSuccessAction(pricesStub));
      store.dispatch(new OffersLoadSuccessAction(offersStub));

      service.getLotteryModelsMap().subscribe((models) => {
        expect(models).toEqual({});
      });
    });

    it('should not create models if no prices', () => {
      store.dispatch(new LotteriesLoadSuccessAction(lotteriesStub));
      store.dispatch(new UpcomingDrawsLoadSuccessAction(drawsStub));
      store.dispatch(new LatestDrawsLoadSuccessAction(drawsStub));
      store.dispatch(new OffersLoadSuccessAction(offersStub));

      service.getLotteryModelsMap().subscribe((models) => {
        expect(models).toEqual({});
      });
    });

    it('should replay last value', () => {
      const spyStoreSelect = spyOn(store, 'select').and.callThrough();

      store.dispatch(new LotteriesLoadSuccessAction(lotteriesStub));
      store.dispatch(new UpcomingDrawsLoadSuccessAction(drawsStub));
      store.dispatch(new LatestDrawsLoadSuccessAction(drawsStub));
      store.dispatch(new PricesLoadSuccessAction(pricesStub));
      store.dispatch(new OffersLoadSuccessAction(offersStub));

      service.getLotteryModelsMap().subscribe();
      service.getLotteryModelsMap().subscribe();

      expect(spyStoreSelect).toHaveBeenCalledTimes(10);
    });
  });

  describe('getSoldLotteryModelsMap', () => {
    it('should filter models map', () => {
      spyOn(service, 'getLotteryModelsMap').and.returnValue(of({
        'megamillions': new LotteryModel(
          lotteryEntitiesStub['megamillions'],
          drawEntitiesStub['megamillions'],
          drawEntitiesStub['megamillions'],
          pricesEntitiesStub['megamillions'],
          offersEntitiesStub['megamillions'],
          '',
          'BIGLOTTERYOWIN_COM',
          'GBP',
          false
        ),
        'powerball': new LotteryModel(
          lotteryEntitiesStub['powerball'],
          drawEntitiesStub['powerball'],
          drawEntitiesStub['powerball'],
          pricesEntitiesStub['powerball'],
          offersEntitiesStub['powerball'],
          '',
          'BIGLOTTERYOWIN_COM',
          'GBP',
          false
        )
      }));

      service.getSoldLotteryModelsMap().subscribe((models) => {
        expect(models).toEqual({
          'powerball': new LotteryModel(
            lotteryEntitiesStub['powerball'],
            drawEntitiesStub['powerball'],
            drawEntitiesStub['powerball'],
            pricesEntitiesStub['powerball'],
            offersEntitiesStub['powerball'],
            '',
            'BIGLOTTERYOWIN_COM',
            'GBP',
            false
          )
        });
      });
    });

    it('should replay last value', () => {
      const spy = spyOn(service, 'getLotteryModelsMap').and.callThrough();

      store.dispatch(new LotteriesLoadSuccessAction(lotteriesStub));
      store.dispatch(new UpcomingDrawsLoadSuccessAction(drawsStub));
      store.dispatch(new LatestDrawsLoadSuccessAction(drawsStub));
      store.dispatch(new PricesLoadSuccessAction(pricesStub));
      store.dispatch(new OffersLoadSuccessAction(offersStub));

      service.getSoldLotteryModelsMap().subscribe();
      service.getSoldLotteryModelsMap().subscribe();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getLotteryModelById', () => {
    it('should return lottery model', () => {
      spyOn(service, 'getLotteryModelsMap').and.returnValue(of({
        'megamillions': new LotteryModel(
          lotteryEntitiesStub['megamillions'],
          drawEntitiesStub['megamillions'],
          drawEntitiesStub['megamillions'],
          pricesEntitiesStub['megamillions'],
          offersEntitiesStub['megamillions'],
          '',
          'BIGLOTTERYOWIN_COM',
          'GBP',
          false
        )
      }));

      service.getLotteryModelById('megamillions').subscribe((model) => {
        expect(model.lotteryId).toBe('megamillions');
      });
    });

    it('should return lottery undefined', () => {
      spyOn(service, 'getLotteryModelsMap').and.returnValue(of({
        'megamillions': new LotteryModel(
          lotteryEntitiesStub['megamillions'],
          drawEntitiesStub['megamillions'],
          drawEntitiesStub['megamillions'],
          pricesEntitiesStub['megamillions'],
          offersEntitiesStub['megamillions'],
          '',
          'BIGLOTTERYOWIN_COM',
          'GBP',
          false
        )
      }));

      service.getLotteryModelById('notalottery').subscribe((model) => {
        expect(model).toBeUndefined();
      });
    });

    it('should replay last value', () => {
      const spyGetLotteryModels = spyOn(service, 'getLotteryModelsMap').and.returnValue(of({
        'megamillions': new LotteryModel(
          lotteryEntitiesStub['megamillions'],
          drawEntitiesStub['megamillions'],
          drawEntitiesStub['megamillions'],
          pricesEntitiesStub['megamillions'],
          offersEntitiesStub['megamillions'],
          '',
          'BIGLOTTERYOWIN_COM',
          'GBP',
          false
        )
      }));

      const model$ = service.getLotteryModelById('megamillions');
      model$.subscribe();
      model$.subscribe();

      expect(spyGetLotteryModels).toHaveBeenCalledTimes(1);
    });
  });

  describe('getLotteryModelByLotId', () => {
    it('should return lottery model', () => {
      spyOn(service, 'getLotteryModelsMap').and.returnValue(of({
        'megamillions': new LotteryModel(
          lotteryEntitiesStub['megamillions'],
          drawEntitiesStub['megamillions'],
          drawEntitiesStub['megamillions'],
          pricesEntitiesStub['megamillions'],
          offersEntitiesStub['megamillions'],
          '',
          'BIGLOTTERYOWIN_COM',
          'GBP',
          false
        ),
        'powerball': new LotteryModel(
          lotteryEntitiesStub['powerball'],
          drawEntitiesStub['powerball'],
          drawEntitiesStub['powerball'],
          pricesEntitiesStub['powerball'],
          offersEntitiesStub['powerball'],
          '',
          'BIGLOTTERYOWIN_COM',
          'GBP',
          false
        )
      }));

      service.getLotteryModelByLotId(12).subscribe((model) => {
        expect(model.lotteryId).toBe('powerball');
      });
    });

    it('should return lottery undefined', () => {
      spyOn(service, 'getLotteryModelsMap').and.returnValue(of({
        'megamillions': new LotteryModel(
          lotteryEntitiesStub['megamillions'],
          drawEntitiesStub['megamillions'],
          drawEntitiesStub['megamillions'],
          pricesEntitiesStub['megamillions'],
          offersEntitiesStub['megamillions'],
          '',
          'BIGLOTTERYOWIN_COM',
          'GBP',
          false
        )
      }));

      service.getLotteryModelByLotId(666).subscribe((model) => {
        expect(model).toBeUndefined();
      });
    });

    it('should replay last value', () => {
      const spyGetLotteryModels = spyOn(service, 'getLotteryModelsMap').and.returnValue(of({
        'megamillions': new LotteryModel(
          lotteryEntitiesStub['megamillions'],
          drawEntitiesStub['megamillions'],
          drawEntitiesStub['megamillions'],
          pricesEntitiesStub['megamillions'],
          offersEntitiesStub['megamillions'],
          '',
          'BIGLOTTERYOWIN_COM',
          'GBP',
          false
        )
      }));

      const model$ = service.getLotteryModelByLotId(10);
      model$.subscribe();
      model$.subscribe();

      expect(spyGetLotteryModels).toHaveBeenCalledTimes(1);
    });
  });

  describe('getLotteriesPopularityOrder', () => {
    it('should return sort order by default ASC', () => {
      spyOn(service, 'getLotteryModelsMap').and.returnValue(of({
        'megamillions': new LotteryModel(
          lotteryEntitiesStub['megamillions'],
          drawEntitiesStub['megamillions'],
          drawEntitiesStub['megamillions'],
          pricesEntitiesStub['megamillions'],
          offersEntitiesStub['megamillions'],
          '',
          'BIGLOTTERYOWIN_COM',
          'GBP',
          false
        ),
        'powerball': new LotteryModel(
          lotteryEntitiesStub['powerball'],
          drawEntitiesStub['powerball'],
          drawEntitiesStub['powerball'],
          pricesEntitiesStub['powerball'],
          offersEntitiesStub['powerball'],
          '',
          'BIGLOTTERYOWIN_COM',
          'GBP',
          false
        )
      }));

      service.getLotteriesPopularityOrder().subscribe((popularityOrder: string[]) => {
        expect(popularityOrder).toEqual(['powerball', 'megamillions']);
      });
    });

    it('should return sort order by ASC', () => {
      spyOn(service, 'getLotteryModelsMap').and.returnValue(of({
        'megamillions': new LotteryModel(
          lotteryEntitiesStub['megamillions'],
          drawEntitiesStub['megamillions'],
          drawEntitiesStub['megamillions'],
          pricesEntitiesStub['megamillions'],
          offersEntitiesStub['megamillions'],
          '',
          'BIGLOTTERYOWIN_COM',
          'GBP',
          false
        ),
        'powerball': new LotteryModel(
          lotteryEntitiesStub['powerball'],
          drawEntitiesStub['powerball'],
          drawEntitiesStub['powerball'],
          pricesEntitiesStub['powerball'],
          offersEntitiesStub['powerball'],
          '',
          'BIGLOTTERYOWIN_COM',
          'GBP',
          false
        )
      }));

      service.getLotteriesPopularityOrder('asc').subscribe((popularityOrder: string[]) => {
        expect(popularityOrder).toEqual(['powerball', 'megamillions']);
      });
    });

    it('should return sort order by DESC', () => {
      spyOn(service, 'getLotteryModelsMap').and.returnValue(of({
        'megamillions': new LotteryModel(
          lotteryEntitiesStub['megamillions'],
          drawEntitiesStub['megamillions'],
          drawEntitiesStub['megamillions'],
          pricesEntitiesStub['megamillions'],
          offersEntitiesStub['megamillions'],
          '',
          'BIGLOTTERYOWIN_COM',
          'GBP',
          false
        ),
        'powerball': new LotteryModel(
          lotteryEntitiesStub['powerball'],
          drawEntitiesStub['powerball'],
          drawEntitiesStub['powerball'],
          pricesEntitiesStub['powerball'],
          offersEntitiesStub['powerball'],
          '',
          'BIGLOTTERYOWIN_COM',
          'GBP',
          false
        )
      }));

      service.getLotteriesPopularityOrder('desc').subscribe((popularityOrder: string[]) => {
        expect(popularityOrder).toEqual(['megamillions', 'powerball']);
      });
    });

    it('should replay last value', () => {
      const spy = spyOn(service, 'getLotteryModelsMap').and.returnValue(of({
        'megamillions': new LotteryModel(
          lotteryEntitiesStub['megamillions'],
          drawEntitiesStub['megamillions'],
          drawEntitiesStub['megamillions'],
          pricesEntitiesStub['megamillions'],
          offersEntitiesStub['megamillions'],
          '',
          'BIGLOTTERYOWIN_COM',
          'GBP',
          false
        ),
        'powerball': new LotteryModel(
          lotteryEntitiesStub['powerball'],
          drawEntitiesStub['powerball'],
          drawEntitiesStub['powerball'],
          pricesEntitiesStub['powerball'],
          offersEntitiesStub['powerball'],
          '',
          'BIGLOTTERYOWIN_COM',
          'GBP',
          false
        )
      }));

      const model$ = service.getLotteriesPopularityOrder('asc');
      model$.subscribe();
      model$.subscribe();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
