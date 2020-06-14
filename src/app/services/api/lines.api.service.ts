import { Injectable } from '@angular/core';
import { BaseSecureApiService } from './base-secure.api.service';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class LinesApiService {

  constructor(private baseSecureApiService: BaseSecureApiService) {
  }

  getOrderedLines() {
    return this.baseSecureApiService.get('/lines/')
      .map(res => res);
  }

  getOrderedLine(lineId: string) {
    return this.baseSecureApiService.get('/lines/' + lineId)
      .map(res => res);
  }

  getSettledLines() {
    return this.baseSecureApiService.get('/lines/settled/')
      .map(res => res);
  }

  getSettledLine(lineId: string) {
    return this.baseSecureApiService.get('/lines/settled/' + lineId)
      .map(res => res);
  }

  getSettledLinesByDraw(drawId: string) {
    const httpParams = new HttpParams().set('draw_id', drawId);
    return this.baseSecureApiService.get('/lines/settled?' + httpParams)
      .map(res => res);
  }

  getSyndicateShares() {
    return this.baseSecureApiService.get('/syndicates/shares')
      .pipe(
        map(response => response.shares)
      );
  }
}
