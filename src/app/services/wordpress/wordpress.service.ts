import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';

import { inArrayHelper } from '@libs/biglotteryowin-core/helpers';

import { environment } from '../../../environments/environment';
import { BrandParamsService } from '../../modules/brand/services/brand-params.service';

@Injectable()
export class WordpressService {
  private baseUrl: string;

  private options = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
    withCredentials: true
  };

  constructor(private httpClient: HttpClient,
              private brandParamsService: BrandParamsService) {
    this.baseUrl = this.getBaseUrl();
  }

  getTrendingNow(): Observable<{
    slug: string;
    title: string;
    date: Date;
    image: string;
    shortContent: string;
  }[]> {
    return this.getCategoryPosts()
      .pipe(
        map(posts => posts.slice(0, 5)),
      );
  }

  getCarouselPosts(): Observable<{
    slug: string;
    title: string;
    date: Date;
    image: string;
  }[]> {
    const httpParams = new HttpParams()
      .set('_embed', 'true');

    return this.get('/carousel', httpParams)
      .pipe(
        map(result => result.map(postDto => ({
          slug: postDto.slug,
          title: postDto.title.rendered,
          date: new Date(postDto.date),
          image: postDto._embedded['wp:featuredmedia'][0].source_url,
        }))),
        catchError(() => of([])),
      );
  }

  getCategoryPosts(categorySlugs = ['blog', 'lottery-news', 'lottery-winners-stories'], page = 1): Observable<{
    slug: string;
    title: string;
    date: Date;
    image: string;
    shortContent: string;
  }[]> {
    return this.getCategoriesMap()
      .pipe(
        switchMap((categoriesMap) => {
          const categoryIds: number[] = Object.keys(categoriesMap)
            .filter(categorySlug => inArrayHelper(categorySlugs, categorySlug))
            .map(categorySlug => categoriesMap[categorySlug].id)
            .filter(categoryId => typeof categoryId !== 'undefined');

          if (categoryIds.length > 0) {
            const httpParams = new HttpParams()
              .set('categories', categoryIds.join())
              .set('page', page.toString())
              .set('_embed', 'true');

            return this.get('/posts', httpParams)
              .pipe(
                map(result => result.map(categoryDto => ({
                  slug: categoryDto.slug,
                  title: categoryDto.title.rendered,
                  date: new Date(categoryDto.date),
                  image: categoryDto._embedded['wp:featuredmedia'][0].source_url,
                  shortContent: categoryDto.excerpt.rendered,
                }))),
              );
          } else {
            return of([]);
          }
        }),
        catchError(() => of([])),
      );
  }

  getTotalPages(categorySlugs = ['blog', 'lottery-news', 'lottery-winners-stories']): Observable<number> {
    return this.getCategoriesMap()
      .pipe(
        map((categoriesMap) => {
          return Object.keys(categoriesMap)
            .filter(categorySlug => inArrayHelper(categorySlugs, categorySlug))
            .reduce((result, categorySlug) => {
              result += categoriesMap[categorySlug].count;
              return result;
            }, 0) / 10;
        })
      );
  }

  getPost(slug: string): Observable<{
    title: string;
    date: Date;
    image: string;
    fullContent: string;
  } | null> {
    const httpParams = new HttpParams()
      .set('slug', slug)
      .set('_embed', 'true');

    return this.get('/posts', httpParams)
      .pipe(
        map(result => {
          return result[0]
            ? {
              title: result[0].title.rendered as string,
              date: new Date(result[0].date),
              image: result[0]._embedded['wp:featuredmedia'][0].source_url,
              fullContent: result[0].content.rendered as string,
            }
            : null;
        }),
        catchError(() => of(null)),
      );
  }

  getLotteryPosts(lotteryId: string) {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('filter[tag]', lotteryId);
    return this.get('/posts', httpParams);
  }

  getPostImg(numberMedia: number) {
    return this.get('/media/' + numberMedia)
      .map(imgObj => imgObj.guid.rendered);
  }

  getCategoriesMap(): Observable<{
    [categorySlug: string]: {
      id: number;
      slug: string;
      name: string;
      count: number;
    }
  }> {
    return this.get('/categories')
      .pipe(
        map(result => result.reduce((categoriesMap, category) => {
          return {
            ...categoriesMap,
            [category.slug]: {
              id: category.id,
              slug: category.slug,
              name: category.name,
              count: category.count
            }
          };
        }, {})),
      );
  }

  getHost(): string {
    const brandId = this.brandParamsService.getBrandId();

    let host = environment.environment === 'local' ? 'http://' : 'https://';

    switch (brandId) {
      case 'BIGLOTTERYOWIN_COM':
        host += 'blog.biglotteryowin.com';
        break;
      default:
        host += 'blog.biglotteryowin.com';
        break;
    }

    return host;
  }

  private getBaseUrl(): string {
    return this.getHost() + '/biglotteryowinzone/wp-json/wp/v2';
  }

  private get(url: string, params?: HttpParams): Observable<any> {
    return this.httpClient.get(this.baseUrl + url, {...this.options, params});
  }
}
