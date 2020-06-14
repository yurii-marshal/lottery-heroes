import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { BaseApiQueryService } from './base-api-query.service';
import { BIGLOTTERYOWIN_BASE_API_URL } from '../../tokens/biglotteryowin-base-api-url.token';

const dataStub = {result: {some: 1, thing: 2}};

describe('BaseApiQueryService', () => {
  const baseApiUrl = 'http://base-api.url';

  let httpMock: HttpTestingController;
  let service: BaseApiQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {provide: BIGLOTTERYOWIN_BASE_API_URL, useValue: baseApiUrl},
        BaseApiQueryService,
      ]
    });

    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(BaseApiQueryService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('get', () => {
    it('should return an Observable<any> without params', () => {
      service.get('/some-url/some-path').subscribe(response => {
        expect(response).toEqual(dataStub);
      });

      const req = httpMock.expectOne(`${baseApiUrl}/some-url/some-path`);
      req.flush(dataStub);

      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toEqual('json');
      expect(req.cancelled).toBeTruthy();
    });

    it('should return an Observable<any> with params', () => {
      const httpParams = new HttpParams().set('param', 'true');

      service.get('/some-url/some-path', httpParams).subscribe(response => {
        expect(response).toEqual(dataStub);
      });

      const req = httpMock.expectOne(`${baseApiUrl}/some-url/some-path?param=true`);
      req.flush(dataStub);

      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toEqual('json');
      expect(req.cancelled).toBeTruthy();
    });
  });
});
