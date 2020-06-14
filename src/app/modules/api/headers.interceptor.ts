import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

import { GlobalService } from '../../services/global.service';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
  constructor(private globalService: GlobalService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.globalService.boSessionHeader$.next(event.headers.get('BO-SESSION'));
          }
        })
      );
  }
}
