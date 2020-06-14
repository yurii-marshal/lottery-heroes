import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/';
import { SessionsService } from '../auth/sessions.service';
import { BrandParamsService } from '../../modules/brand/services/brand-params.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class BaseSecureApiService {
  private baseUrl: string;

  private options = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
    withCredentials: true
  };

  constructor(private httpClient: HttpClient,
              private sessionService: SessionsService,
              private brandParamsService: BrandParamsService) {
    this.baseUrl = brandParamsService.getApiUrl();
  }

  get(url: string, params?: HttpParams): Observable<any> {
    return this.inspectionSession()
      .filter(res => res === true)
      .switchMapTo(this.httpClient.get(this.baseUrl + url, {...this.options, params}))
      .catch(error => ErrorObservable.create(error.error));
  }

  post(url: string, body: string): Observable<any> {
    return this.inspectionSession()
      .filter(res => res === true)
      .switchMapTo(this.httpClient.post(this.baseUrl + url, body, this.options))
      .catch(error => ErrorObservable.create(error.error));
  }

  put(url: string, body: string): Observable<any> {
    return this.inspectionSession()
      .filter(x => x === true)
      .switchMapTo(this.httpClient.put(this.baseUrl + url, body, this.options))
      .catch(error => ErrorObservable.create(error.error));
  }

  delete(url: string) {
    return this.inspectionSession()
      .filter(x => x === true)
      .switchMapTo(this.httpClient.delete(this.baseUrl + url, this.options))
      .catch(error => ErrorObservable.create(error.error));
  }

  inspectionSession(): Observable<boolean> {
    if (!this.sessionService.isSessionExist()) {
      return this.sessionService.autologin();
    } else {
      return of(true);
    }
  }
}
