import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map, mapTo, switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CmsService } from '../../modules/cms/services/cms.service';
import { MetaService } from '../../modules/meta/services/meta.service';

import { Store } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { getRouterStateUrl, RouterStateUrl } from '@libs/router-store/reducers';

import { AboutLotteryPageCmsInterface } from './entities/about-lottery-page-cms.interface';
import { ObjectsUtil } from '../../modules/shared/utils/objects.util';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { LotteriesService } from '../../services/lotteries/lotteries.service';
import { SlugsMapInterface } from '../../services/lotteries/entities/interfaces/slugs-map.interface';

@Component({
  selector: 'app-about-lottery-page-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="loaded$|async">
      <ng-container *ngIf="cms$|async; else notFoundTpl">
        <app-about-lottery-page-component
          [cms]="cms$|async"
          [lotteryId]="lotteryId$|async"
        ></app-about-lottery-page-component>
      </ng-container>
      <ng-template #notFoundTpl>
        <app-page404></app-page404>
      </ng-template>
    </ng-container>
  `,
})
export class AboutLotteryPageContainerComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();
  public loaded$ = new BehaviorSubject<boolean>(false);
  public cms$: Observable<AboutLotteryPageCmsInterface>;
  public lotteryId$: Observable<string>;

  constructor(private router: Router,
              private metaService: MetaService,
              private cmsService: CmsService,
              private store: Store<RouterReducerState<RouterStateUrl>>,
              private lotteriesService: LotteriesService) {
  }

  ngOnInit(): void {
    this.cms$ = this.store.select(getRouterStateUrl).pipe(
      map((routerStateUrl: RouterStateUrl) => this.getCmsSlug(routerStateUrl)),
      switchMap((slug: string) => this.cmsService.getPageData(slug)),
      map((cms: any) => ObjectsUtil.isEmptyObject(cms) ? null : cms),
    );

    this.cms$
      .pipe(
        takeUntil(this.unsubscribe$),
        mapTo(true)
      ).subscribe(this.loaded$);

    this.lotteryId$ = combineLatest(
      this.store.select(getRouterStateUrl),
      this.lotteriesService.getSlugsMap()
    )
      .pipe(
        map(([state, slugsMap]: [any, SlugsMapInterface]) => {
          return Object.keys(slugsMap).find(key => slugsMap[key] === state.params.lotterySlug);
        })
      );

    this.cms$
      .pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe((cms: AboutLotteryPageCmsInterface) => this.setMeta(cms));
  }

  private setMeta(cms: AboutLotteryPageCmsInterface): void {
    if (cms !== null && typeof cms.meta_title !== undefined) {
      this.metaService.setTitle(cms.meta_title);
    }

    if (cms !== null && typeof cms.meta_description !== undefined) {
      this.metaService.setMetaDescription(cms.meta_description);
    }
  }

  private getCmsSlug(routerStateUrl: RouterStateUrl): string {
    return routerStateUrl.urlWithoutQueryParams.split('/').join('-').substring(1);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
