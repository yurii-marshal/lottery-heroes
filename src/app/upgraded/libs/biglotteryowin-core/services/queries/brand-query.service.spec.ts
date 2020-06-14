import { TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { ENVIRONMENT } from '@libs/environment/tokens/environment.token';
import { EnvironmentQueryService } from '@libs/environment/services/queries/environment-query.service';
import { RequestQueryService } from '@libs/environment/services/queries/request-query.service';

import { BrandQueryService } from './brand-query.service';
import { biglotteryowinCoreReducers } from '../../store/reducers';
import { BrandsLoadAction, BrandsLoadSuccessAction } from '../../store/actions/brands.actions';

const brandsStub = require('@libs/biglotteryowin-api/stubs/luv/brands.stub.json');

describe('BrandQueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          'BiglotteryowinCore': combineReducers(biglotteryowinCoreReducers)
        }),
      ],
      providers: [
        {provide: ENVIRONMENT, useValue: {}},
        EnvironmentQueryService,
        RequestQueryService,
        BrandQueryService,
      ]
    });
  });

  describe('getBrandId', () => {
    it('should return a brand id from environment', () => {
      TestBed.configureTestingModule({
        providers: [
          {provide: ENVIRONMENT, useValue: {brandId: 'SOME_BRAND_ID'}},
        ]
      });

      const service = TestBed.get(BrandQueryService);
      expect(service.getBrandId()).toBe('SOME_BRAND_ID');
    });

    it('should return a brand id from hostname', () => {
      const service = TestBed.get(BrandQueryService);
      spyOn(TestBed.get(RequestQueryService), 'getHost').and.returnValue('www.biglotteryowin.com');
      expect(service.getBrandId()).toBe('BIGLOTTERYOWIN_COM');
    });

    it('should return a default brand id if hostname is unknown', () => {
      const service = TestBed.get(BrandQueryService);
      spyOn(TestBed.get(RequestQueryService), 'getHost').and.returnValue('');
      expect(service.getBrandId()).toBe('BIGLOTTERYOWIN_COM');
    });

    it('should return a wrong default BIGLOTTERYOWIN_COM if hostname is localhost:5000', () => {
      const service = TestBed.get(BrandQueryService);
      spyOn(TestBed.get(RequestQueryService), 'getHost').and.returnValue('localhost:5000');
      expect(service.getBrandId()).toBe('BIGLOTTERYOWIN_COM');
    });
  });

  describe('getBrandApiUrl', () => {
    it('should return a url', () => {
      TestBed.configureTestingModule({
        providers: [
          {provide: ENVIRONMENT, useValue: {environment: 'production'}},
        ]
      });

      const service = TestBed.get(BrandQueryService);
      spyOn(TestBed.get(RequestQueryService), 'getHost').and.returnValue('www.biglotteryowin.com');
      expect(service.getBrandApiUrl()).toBe('https://api.biglotteryowin.com');
    });

    it('should throw error if environment is not set', () => {
      TestBed.configureTestingModule({
        providers: [
          {provide: ENVIRONMENT, useValue: {}},
        ]
      });

      const service = TestBed.get(BrandQueryService);
      spyOn(TestBed.get(RequestQueryService), 'getHost').and.returnValue('www.biglotteryowin.com');
      expect(() => service.getBrandApiUrl()).toThrowError('Environment value is not set.');
    });
  });

  describe('getBrandCurrencyId', () => {
    it('should dispatch BrandsLoadAction if not loaded and wait', () => {
      const service = TestBed.get(BrandQueryService);
      const store = TestBed.get(Store);
      const spyStoreDispatch = spyOn(store, 'dispatch').and.callThrough();

      service.getBrandCurrencyId().subscribe((data) => {
        fail('Subscription has been called');
      });

      expect(spyStoreDispatch).toHaveBeenCalledTimes(1);
      expect(spyStoreDispatch).toHaveBeenCalledWith(new BrandsLoadAction());
    });

    it('should not dispatch BrandsLoadAction if loaded and return correct currencyId', () => {
      const service = TestBed.get(BrandQueryService);
      const store = TestBed.get(Store);
      const spyStoreDispatch = spyOn(store, 'dispatch').and.callThrough();

      store.dispatch(new BrandsLoadSuccessAction(brandsStub));

      spyOn(service, 'getBrandId').and.returnValue('BIGLOTTERYOWIN_COM');
      service.getBrandCurrencyId().subscribe((currencyId) => {
        expect(currencyId).toBe('GBP');
      });

      expect(spyStoreDispatch).toHaveBeenCalledTimes(1);
    });

    it('should throw error if brand does not exists', () => {
      const service = TestBed.get(BrandQueryService);
      const store = TestBed.get(Store);

      store.dispatch(new BrandsLoadSuccessAction(brandsStub));

      spyOn(service, 'getBrandId').and.returnValue('SOME_NOT_EXISTING_BRAND');
      service.getBrandCurrencyId().subscribe((data) => {
        fail('Subscription has been called');
      }, (error: Error) => {
        expect(error.message).toBe('Brand SOME_NOT_EXISTING_BRAND does not exist in brands entities.');
      });
    });

    it('should replay last value', () => {
      const service = TestBed.get(BrandQueryService);
      const store = TestBed.get(Store);
      const spyStoreDispatch = spyOn(store, 'select').and.callThrough();

      store.dispatch(new BrandsLoadSuccessAction(brandsStub));

      service.getBrandCurrencyId().subscribe();
      service.getBrandCurrencyId().subscribe();

      expect(spyStoreDispatch).toHaveBeenCalledTimes(2);
    });
  });
});
