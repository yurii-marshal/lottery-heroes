import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { Observable } from 'rxjs/Observable';
import { map, switchMap } from 'rxjs/operators';

import { WordpressService } from '../../services/wordpress/wordpress.service';
import { getRouterStateUrl, RouterStateUrl } from '../../upgraded/libs/router-store/reducers';

@Component({
  selector: 'app-blog-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-blog
      [posts]="posts$|async"
      [host]="host"
      [totalPages]="totalPages$|async"
      [activePage]="activePage$|async"
    ></app-blog>`,
})
export class BlogContainerComponent implements OnInit {
  posts$: Observable<any[]>;
  host: string;
  totalPages$: Observable<number>;
  activePage$: Observable<number>;

  constructor(private wordpressService: WordpressService,
              private store: Store<RouterReducerState<RouterStateUrl>>) {
  }

  ngOnInit() {
    this.posts$ = this.store.select(getRouterStateUrl)
      .pipe(
        switchMap((routerStateUrl: RouterStateUrl) => {
          const categorySlug = routerStateUrl.data['categorySlug'];
          const page = routerStateUrl.params['page'];

          return this.wordpressService.getCategoryPosts(categorySlug, page);
        })
      );

    this.host = this.wordpressService.getHost();

    this.activePage$ = this.store.select(getRouterStateUrl)
      .pipe(
        map((routerStateUrl: RouterStateUrl) => routerStateUrl.params['page'] || 1)
      );

    this.totalPages$ = this.store.select(getRouterStateUrl)
      .pipe(
        switchMap((routerStateUrl: RouterStateUrl) => {
          const categorySlug = routerStateUrl.data['categorySlug'];
          return this.wordpressService.getTotalPages(categorySlug);
        })
      );
  }
}
