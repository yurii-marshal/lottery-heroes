import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseApiService } from './base.api.service';
import { VisitorCountryInterface } from './entities/incoming/visitor-country.interface';
import { HttpParams } from '@angular/common/http';


@Injectable()
export class VisitorCountryApiService {

  constructor(private baseApiService: BaseApiService) {
  }

  getVisitorCountry(params?: any): Observable<VisitorCountryInterface> {
    let httpParams = new HttpParams();

    if (params && params.brandId) {
      httpParams = httpParams.set('brand_id', params.brandId);
    }

    if (params && params.ip) {
      httpParams = httpParams.set('ip', params.ip);
    }

    return this.baseApiService.get('/visitor-country', httpParams);
  }
}
