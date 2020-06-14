import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { filter, map, publishLast, refCount, switchMap } from 'rxjs/operators';

import { CmsBrandInterface } from '../entities/cms-brand.interface';
import { BrandParamsService } from '../../brand/services/brand-params.service';
import { MemoryCacheService } from '../../../services/cache/memory-cache.service';

@Injectable()
export class CmsService {
  private baseUrl$: Observable<string>;
  private brandId: string;

  constructor(private httpClient: HttpClient,
              private memoryCacheService: MemoryCacheService,
              private brandParamService: BrandParamsService) {
    this.baseUrl$ = this.brandParamService.getCmsUrl();
    this.brandId = this.brandParamService.getBrandId();
  }

  private getByUrl(url: string): Observable<any> {
    if (!this.memoryCacheService.hasData(url)) {
      this.memoryCacheService.setData(url, this.httpClient.get(url).pipe(publishLast(), refCount()));
    }
    return this.memoryCacheService.getData(url);
  }

  private getCmsBrandId(brandId: string): Observable<number> {
    return this.baseUrl$
      .pipe(
        switchMap(baseUrl => this.getByUrl(baseUrl + 'brand')),
        map((response: Array<CmsBrandInterface>) => response.find(element => element.name === brandId)),
        filter((element: CmsBrandInterface | undefined) => typeof element !== 'undefined'),
        map((element: CmsBrandInterface) => element.id)
      );
  }

  getPageData(slug: string): Observable<any> {
    return this.baseUrl$
      .pipe(
        switchMap((baseUrl: string) => this.getByUrl(baseUrl + `?slug=${slug}-${this.brandId}`)),
        map((response: any) => {
          return (response && response.length > 0) ? response[0].acf : {};
        })
      );
  }
}
