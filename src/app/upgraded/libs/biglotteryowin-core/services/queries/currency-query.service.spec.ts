import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';

import { BrandQueryService } from './brand-query.service';
import { CurrencyQueryService } from './currency-query.service';

describe('CurrencyQueryService', () => {
  let service: CurrencyQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: BrandQueryService,
          useValue: jasmine.createSpyObj<BrandQueryService>('BrandQueryService', {
            getBrandCurrencyId: of('GBP')
          })
        },
        CurrencyQueryService,
      ]
    });

    service = TestBed.get(CurrencyQueryService);
  });

  describe('getSiteCurrencyId', () => {
    it('should return currencyId from brand', () => {
      service.getSiteCurrencyId().subscribe((currencyId: string) => {
        expect(currencyId).toBe('GBP');
      });
    });
  });
});
