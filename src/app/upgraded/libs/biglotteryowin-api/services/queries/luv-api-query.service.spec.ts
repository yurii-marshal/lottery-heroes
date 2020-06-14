import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LuvApiQueryService } from './luv-api-query.service';
import { BaseApiQueryService } from './base-api-query.service';
import { BIGLOTTERYOWIN_BASE_API_URL } from '../../tokens/biglotteryowin-base-api-url.token';

const brandsStub = require('../../stubs/luv/brands.stub.json');

describe('LuvApiQueryService', () => {
  const baseApiUrl = 'http://base-api.url';

  let httpMock: HttpTestingController;
  let service: LuvApiQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {provide: BIGLOTTERYOWIN_BASE_API_URL, useValue: baseApiUrl},
        BaseApiQueryService,
        LuvApiQueryService,
      ]
    });

    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(LuvApiQueryService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getBrands', () => {
    it('should return an Observable<BrandDto[]>', () => {
      service.getBrands().subscribe(brands => {
        expect(brands).toEqual(brandsStub);
      });

      const req = httpMock.expectOne(`${baseApiUrl}/luv/brands`);
      req.flush({brands: brandsStub});

      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toEqual('json');
      expect(req.cancelled).toBeTruthy();
    });
  });
});
