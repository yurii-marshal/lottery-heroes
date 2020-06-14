import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { map, mapTo, switchMap, takeUntil } from 'rxjs/operators';

import { getRouterStateUrl, RouterStateUrl } from '@libs/router-store/reducers';

import { StaticPageCmsInterface } from './entities/static-page-cms.interface';
import { CmsService } from '../../modules/cms/services/cms.service';
import { MetaService } from '../../modules/meta/services/meta.service';
import { ObjectsUtil } from '../../modules/shared/utils/objects.util';

@Component({
  selector: 'app-static-page-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="loaded$|async">
      <ng-container *ngIf="cms$|async; else notFoundTpl">
        <app-static-page
          [cms]="cms$|async"
        ></app-static-page>
      </ng-container>
      <ng-template #notFoundTpl>
        <app-page404></app-page404>
      </ng-template>
    </ng-container>
  `,
})
export class StaticPageContainerComponent implements OnInit, OnDestroy {
  loaded$ = new BehaviorSubject<boolean>(false);
  cms$: Observable<StaticPageCmsInterface>;

  private unsubscribe$ = new Subject<void>();

  constructor(private store: Store<RouterReducerState<RouterStateUrl>>,
              private cmsService: CmsService,
              private metaService: MetaService) {
  }

  ngOnInit(): void {
    this.cms$ = this.store.select(getRouterStateUrl).pipe(
      map((routerStateUrl: RouterStateUrl) => this.getCmsSlug(routerStateUrl)),
      switchMap((slug: string) => this.cmsService.getPageData(slug)),
      map((cms: any) => ObjectsUtil.isEmptyObject(cms) ? null : cms),
    );

    this.cms$.pipe(
      takeUntil(this.unsubscribe$),
      mapTo(true)
    ).subscribe(this.loaded$);

    this.cms$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((cms: StaticPageCmsInterface) => this.setMeta(cms));
  }

  private getCmsSlug(routerStateUrl: RouterStateUrl): string {
    return routerStateUrl.urlWithoutQueryParams.split('/').join('-').substring(1);
  }

  private setMeta(cms: StaticPageCmsInterface): void {
    if (cms !== null && typeof cms.meta_title !== undefined) {
      this.metaService.setTitle(cms.meta_title);
    }

    if (cms !== null && typeof cms.meta_description !== undefined) {
      this.metaService.setMetaDescription(cms.meta_description);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
