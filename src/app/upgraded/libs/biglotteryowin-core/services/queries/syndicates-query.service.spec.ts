import { TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs/observable/of';

import { LotteriesQueryService } from './lotteries-query.service';
import { CurrencyQueryService } from './currency-query.service';
import { QaQueryService } from './qa-query.service';
import { SyndicatesQueryService } from './syndicates-query.service';
import { SyndicatesLoadAction, SyndicatesLoadSuccessAction } from '../../store/actions/syndicates.actions';
import { biglotteryowinCoreReducers, BiglotteryowinCoreState } from '../../store/reducers';
import { SyndicateModel } from '../../models/syndicate.model';
import { LotteryModel } from '../../models/lottery.model';
import { syndicateEntitiesStub } from '../../stubs/syndicate-entities.stub';
import { lotteryEntitiesStub } from '../../stubs/lottery-entities.stub';
import { drawEntitiesStub } from '../../stubs/draw-entities.stub';
import { pricesEntitiesStub } from '@libs/biglotteryowin-core/stubs/prices-entities.stub';
import { offersEntitiesStub } from '@libs/biglotteryowin-core/stubs/offers-entities.stub';

const syndicatesStub = require('@libs/biglotteryowin-api/stubs/offerings/syndicates.stub.json');
const lotteryModelStub = new LotteryModel(
  lotteryEntitiesStub['powerball'],
  drawEntitiesStub['powerball'],
  drawEntitiesStub['powerball'],
  pricesEntitiesStub['powerball'],
  offersEntitiesStub['powerball'],
  'https://www.biglotteryowin.com',
  'BIGLOTTERYOWIN_COM',
  'GBP',
  false
);

describe('SyndicatesQueryService', () => {
  let service: SyndicatesQueryService;
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
          provide: LotteriesQueryService,
          useValue: jasmine.createSpyObj<LotteriesQueryService>('LotteriesQueryService', {
            getLotteryModelsMap: of({
              'powerball': {
                lotteryId: 'powerball'
              }
            })
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
        SyndicatesQueryService,
      ]
    });

    service = TestBed.get(SyndicatesQueryService);
    store = TestBed.get(Store);
  });

  describe('getSyndicateModelsMap', () => {
    it('should dispatch load actions if not loaded and wait', () => {
      const spyStoreDispatch = spyOn(store, 'dispatch').and.callThrough();

      service.getSyndicateModelsMap().subscribe((data) => {
        fail('Subscription has been called');
      });

      expect(spyStoreDispatch).toHaveBeenCalledTimes(1);
      expect(spyStoreDispatch).toHaveBeenCalledWith(new SyndicatesLoadAction());
    });

    it('should not dispatch load actions if loaded', () => {
      const spyStoreDispatch = spyOn(store, 'dispatch').and.callThrough();

      store.dispatch(new SyndicatesLoadSuccessAction(syndicatesStub));

      expect(spyStoreDispatch).toHaveBeenCalledTimes(1);
      expect(spyStoreDispatch).not.toHaveBeenCalledWith(new SyndicatesLoadAction());
    });

    it('should replay last value', () => {
      const spyStoreSelect = spyOn(store, 'select').and.callThrough();

      store.dispatch(new SyndicatesLoadSuccessAction(syndicatesStub));

      service.getSyndicateModelsMap().subscribe();
      service.getSyndicateModelsMap().subscribe();

      expect(spyStoreSelect).toHaveBeenCalledTimes(5);
    });
  });

  describe('getSyndicateModelById', () => {
    it('should return syndicate model', () => {
      spyOn(service, 'getSyndicateModelsMap').and.returnValue(of({
        'powerball': new SyndicateModel(
          syndicateEntitiesStub['powerball'],
          lotteryModelStub,
          drawEntitiesStub['powerball'],
          'GBP',
          false
        )
      }));

      service.getSyndicateModelByLotteryId('powerball').subscribe((model) => {
        expect(model.lotteryId).toBe('powerball');
      });
    });

    it('should return syndicate undefined', () => {
      spyOn(service, 'getSyndicateModelsMap').and.returnValue(of({
        'powerball': new SyndicateModel(
          syndicateEntitiesStub['powerball'],
          lotteryModelStub,
          drawEntitiesStub['powerball'],
          'GBP',
          false
        )
      }));

      service.getSyndicateModelByLotteryId('notasyndicate').subscribe((model) => {
        expect(model).toBeUndefined();
      });
    });

    it('should replay last value', () => {
      const spyGetSyndicateModels = spyOn(service, 'getSyndicateModelsMap').and.returnValue(of({
        'powerball': new SyndicateModel(
          syndicateEntitiesStub['powerball'],
          lotteryModelStub,
          drawEntitiesStub['powerball'],
          'GBP',
          false
        )
      }));

      const model$ = service.getSyndicateModelByLotteryId('powerball');
      model$.subscribe();
      model$.subscribe();

      expect(spyGetSyndicateModels).toHaveBeenCalledTimes(1);
    });
  });
});
