import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BIGLOTTERYOWIN_BASE_API_URL } from '../../tokens/biglotteryowin-base-api-url.token';
import { BaseApiQueryService } from './base-api-query.service';
import { OfferingsApiQueryService } from './offerings-api-query.service';

const syndicatesStub = require('../../stubs/offerings/syndicates.stub.json');
const pricesStub = require('../../stubs/offerings/prices.stub.json');
const offersStub = require('../../stubs/offerings/offers.stub.json');

describe('OfferingsApiQueryService', () => {
  const baseApiUrl = 'http://base-api.url';

  let httpMock: HttpTestingController;
  let service: OfferingsApiQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {provide: BIGLOTTERYOWIN_BASE_API_URL, useValue: baseApiUrl},
        BaseApiQueryService,
        OfferingsApiQueryService,
      ]
    });

    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(OfferingsApiQueryService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getSyndicates', () => {
    it('should return observable of syndicates', () => {
      service.getSyndicates('BRAND_ID').subscribe(syndicates => {
        expect(syndicates).toEqual(syndicatesStub);
      });

      const req = httpMock.expectOne(`${baseApiUrl}/offerings/syndicates/BRAND_ID`);
      req.flush({syndicates: syndicatesStub});

      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toEqual('json');
      expect(req.cancelled).toBeTruthy();
    });
  });

  describe('getPrices', () => {
    it('should return observable of prices', () => {
      service.getPrices('BRAND_ID').subscribe(prices => {
        expect(prices).toEqual(pricesStub);
      });

      const req = httpMock.expectOne(`${baseApiUrl}/offerings/prices/BRAND_ID`);
      req.flush({prices: pricesStub});

      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toEqual('json');
      expect(req.cancelled).toBeTruthy();
    });
  });

  describe('getSyndicates', () => {
    it('should return observable of offers', () => {
      service.getOffers('BRAND_ID').subscribe(offers => {
        expect(offers).toEqual(offersStub);
      });

      const req = httpMock.expectOne(`${baseApiUrl}/offerings/offers/BRAND_ID`);
      req.flush({offers: offersStub});

      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toEqual('json');
      expect(req.cancelled).toBeTruthy();
    });
  });
});
