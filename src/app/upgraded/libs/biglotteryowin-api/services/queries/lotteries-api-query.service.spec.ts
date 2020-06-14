import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BIGLOTTERYOWIN_BASE_API_URL } from '../../tokens/biglotteryowin-base-api-url.token';
import { LotteriesApiQueryService } from './lotteries-api-query.service';
import { BaseApiQueryService } from './base-api-query.service';

const lotteriesStub = require('../../stubs/lotteries/lotteries.stub.json');
const drawsStub = require('../../stubs/lotteries/draws.stub.json');
const getSingleDrawStub = require('../../stubs/lotteries/get-single-draw.stub.json');

describe('LotteriesApiQueryService', () => {
  const baseApiUrl = 'http://base-api.url';

  let httpMock: HttpTestingController;
  let service: LotteriesApiQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {provide: BIGLOTTERYOWIN_BASE_API_URL, useValue: baseApiUrl},
        BaseApiQueryService,
        LotteriesApiQueryService,
      ]
    });

    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(LotteriesApiQueryService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getLotteries', () => {
    it('should return an Observable<LotteryDto[]>', () => {
      service.getLotteries('BIGLOTTERYOWIN_COM').subscribe(lotteries => {
        expect(lotteries).toEqual(lotteriesStub);
      });

      const req = httpMock.expectOne(`${baseApiUrl}/lotteries?brand_id=BIGLOTTERYOWIN_COM`);
      req.flush({lotteries: lotteriesStub});

      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toEqual('json');
      expect(req.cancelled).toBeTruthy();
    });
  });

  describe('getDraws', () => {
    it('should throw an error if upcoming and latest set together', () => {
      expect(() => service.getDraws({currencyId: 'GBP', upcoming: true, latest: true}))
        .toThrowError('Upcoming and latest must not be set together.');
    });

    it('should throw an error if not upcoming nor latest set', () => {
      expect(() => service.getDraws({currencyId: 'GBP'}))
        .toThrowError('Upcoming or latest must be set.');
    });

    it('should return an Observable<DrawDto[]> with upcoming param', () => {
      service.getDraws({currencyId: 'GBP', upcoming: true}).subscribe(draws => {
        expect(draws).toEqual(drawsStub);
      });

      const req = httpMock.expectOne(`${baseApiUrl}/lotteries/draws?currency-id=GBP&upcoming=true`);
      req.flush({draws: drawsStub});

      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toEqual('json');
      expect(req.cancelled).toBeTruthy();
    });

    it('should return an Observable<DrawDto[]> with latest param', () => {
      service.getDraws({currencyId: 'GBP', latest: true}).subscribe(draws => {
        expect(draws).toEqual(drawsStub);
      });

      const req = httpMock.expectOne(`${baseApiUrl}/lotteries/draws?currency-id=GBP&latest=true`);
      req.flush({draws: drawsStub});

      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toEqual('json');
      expect(req.cancelled).toBeTruthy();
    });
  });

  describe('getDrawsById', () => {
    it('should return an Observable<DrawDto[]>', () => {
      service.getDrawsById([555, 666], 'GBP').subscribe(draws => {
        expect(draws).toEqual(drawsStub);
      });

      const req = httpMock
        .expectOne(`${baseApiUrl}/lotteries/draws?status-id=open,settled,closed,reported,cancelled&currency-id=GBP&draw-id=555,666`);
      req.flush({draws: drawsStub});

      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toEqual('json');
      expect(req.cancelled).toBeTruthy();
    });
  });

  describe('getDrawByDateLocal', () => {
    it('should return an Observable<SingleDrawDto>', () => {
      service.getDrawByDateLocal('powerball', '2018-03-28').subscribe(draw => {
        expect(draw).toEqual(getSingleDrawStub);
      });

      const req = httpMock.expectOne(`${baseApiUrl}/lotteries/powerball/2018-03-28`);
      req.flush(getSingleDrawStub);

      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toEqual('json');
      expect(req.cancelled).toBeTruthy();
    });
  });
});
