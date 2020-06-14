import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { BIGLOTTERYOWIN_BASE_API_URL } from '../../tokens/biglotteryowin-base-api-url.token';

@Injectable()
export class BaseApiQueryService {
  constructor(@Inject(BIGLOTTERYOWIN_BASE_API_URL) private baseApiUrl: string,
              private httpClient: HttpClient) {
  }

  get(url: string, params?: HttpParams): Observable<any> {
    return this.httpClient.get(this.baseApiUrl + url, {params});
  }
}
