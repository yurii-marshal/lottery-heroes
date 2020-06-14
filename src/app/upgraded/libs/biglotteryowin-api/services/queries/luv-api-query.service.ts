import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { BaseApiQueryService } from './base-api-query.service';
import { GetBrandsDto, BrandDto } from '../../dto/luv/get-brands.dto';

@Injectable()
export class LuvApiQueryService {
  constructor(private baseApiQueryService: BaseApiQueryService) {
  }

  getBrands(): Observable<BrandDto[]> {
    return this.baseApiQueryService.get('/luv/brands')
      .pipe(
        map((response: GetBrandsDto) => response.brands)
      );
  }
}
