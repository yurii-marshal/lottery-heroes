import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { getRouterStateUrl, RouterStateUrl } from '@libs/router-store/reducers';
import { Store } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { Observable } from 'rxjs/Observable';
import { WordpressService } from '../../../../services/wordpress/wordpress.service';
import { mapTo, switchMap, takeUntil } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-blog-post-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-blog-post
      *ngIf="post$|async"
      [post]="post$ | async"
      [host]="host"
    ></app-blog-post>
    <app-page404
      *ngIf="(loaded$|async) && !(post$|async)"
    ></app-page404>
  `,
})
export class BlogPostContainerComponent implements OnInit {


  post$: Observable<{
    title: string;
    date: Date;
    image: string;
    fullContent: string;
  } | null>;

  private unsubscribe$ = new Subject<void>();
  loaded$ = new BehaviorSubject<boolean>(false);
  host: string;

  constructor(private store: Store<RouterReducerState<RouterStateUrl>>,
              private wordpressService: WordpressService) {
  }

  ngOnInit() {
    this.host = this.wordpressService.getHost();

    this.post$ = this.store.select(getRouterStateUrl)
      .pipe(
        switchMap((routerStateUrl: RouterStateUrl) => {
          return this.wordpressService.getPost(routerStateUrl.params.postSlug);
        }),
      );

    this.post$.pipe(
      takeUntil(this.unsubscribe$),
      mapTo(true)
    ).subscribe(this.loaded$);
  }

}
