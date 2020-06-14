import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

export interface TransferHttpResponse {
  body?: any | null;
  headers?: { [k: string]: string[] };
  status?: number;
  statusText?: string;
  url?: string;
}

const ALLOWED_URLS_PATTERNS = [
  // match /lotteries
  '^\/lotteries?$',

  // match /luv/brands url
  '^\/luv\/brands?$',

  // match /luv/currencies url
  '^\/luv\/currencies?$',

  // match /luv/countries url
  '^\/luv\/countries?$',

  // match /lottery_pages from cms
  '^\/wp-json\/wp\/v2\/lottery_pages$'
];

@Injectable()
export class TransferStateInterceptor implements HttpInterceptor {

  constructor(
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    const storeKey = makeStateKey<TransferHttpResponse>(req.urlWithParams);

    if (isPlatformBrowser(this.platformId)) {
      if (!this.transferState.hasKey(storeKey)) {
        return next.handle(req);
      }

      const response = this.transferState.get(storeKey, {} as TransferHttpResponse);

      return of(new HttpResponse<any>({
        body: response.body,
        headers: new HttpHeaders(response.headers),
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      }));

    } else {
      const httpEvent = next.handle(req);

      return httpEvent
        .pipe(
          tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse && this.isUrlAllowed(event.url)) {
              this.transferState.set(storeKey, {
                body: event.body,
                headers: this.getHeadersMap(event.headers),
                status: event.status,
                statusText: event.statusText,
                url: event.url,
              });
            }
          })
        );
    }
  }

  getHeadersMap(headers: HttpHeaders) {
    const headersMap: { [name: string]: string[] } = {};

    for (const key of headers.keys()) {
      headersMap[key] = headers.getAll(key);
    }
    return headersMap;
  }

  private isUrlAllowed(url: string): boolean {
    const paramsIndex = url.indexOf('?');

    // Removed params from url
    if (paramsIndex > 0) {
      url = url.substring(0, paramsIndex);
    }

    // Removed last slash from url if exists
    if (url.lastIndexOf('/') === 0) {
      url = url.substring(0, url.length - 1);
    }

    const host = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)[0];

    url = url.replace(host, '');

    return ALLOWED_URLS_PATTERNS.some((pattern: string) => {
      const regexp = new RegExp(pattern, 'i');

      return regexp.test(url);
    });
  }

}
