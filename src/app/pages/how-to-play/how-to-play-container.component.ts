import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { first, map, mapTo, switchMap, takeUntil } from 'rxjs/operators';
import { CmsService } from '../../modules/cms/services/cms.service';
import { MetaService } from '../../modules/meta/services/meta.service';
import { HowToPlayCmsInterface } from './entities/how-to-play-cms.interface';

import { Store } from '@ngrx/store';
import { ClickPlayLotteryAction } from './strore/actions/how-to-play.actions';
import { StaticPageCmsInterface } from '../static-page/entities/static-page-cms.interface';
import { getRouterStateUrl, RouterStateUrl } from '@libs/router-store/reducers';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ObjectsUtil } from '../../modules/shared/utils/objects.util';
import { RouterReducerState } from '@ngrx/router-store';
import { LotteriesService } from '../../services/lotteries/lotteries.service';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { SlugsMapInterface } from '../../services/lotteries/entities/interfaces/slugs-map.interface';

@Component({
  selector: 'app-how-to-play-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="loaded$|async">
      <ng-container *ngIf="cms$|async; else notFoundTpl">
        <app-how-to-play
          [cms]="cms$ | async"
          [lotterySlug]="lotterySlug$ | async"
          [lotteryId]="lotteryId$ | async"
          (clickPlayLotteryEvent)="onClickPlayLotteryEvent($event)"
        ></app-how-to-play>
      </ng-container>
      <ng-template #notFoundTpl>
        <app-page404></app-page404>
      </ng-template>
    </ng-container>
  `
})
export class HowToPlayContainerComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();
  public cms$: Observable<HowToPlayCmsInterface>;
  public lotterySlug$: Observable<string>;
  public lotteryId$: Observable<string>;
  public loaded$ = new BehaviorSubject<boolean>(false);

  constructor(private cmsService: CmsService,
              private metaService: MetaService,
              private route: ActivatedRoute,
              private router: Router,
              private store: Store<RouterReducerState<RouterStateUrl>>,
              private lotteriesService: LotteriesService) {
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

    this.lotterySlug$ = this.store.select(getRouterStateUrl).pipe(
      map(state => state.params.lotterySlug)
    );

    this.lotteryId$ =
    combineLatest(
      this.lotterySlug$,
      this.lotteriesService.getSlugsMap()
    )
      .pipe(
        first(),
        map(([lotterySlug, slugsMap]: [string, SlugsMapInterface]) => {
          return Object.keys(slugsMap).find(key => slugsMap[key] === lotterySlug);
        })
      );

    this.cms$.pipe(
      takeUntil(this.unsubscribe$))
      .subscribe((cms: HowToPlayCmsInterface) => this.setMeta(cms));
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

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onClickPlayLotteryEvent(lotteryId): void {
    this.store.dispatch(new ClickPlayLotteryAction({lotteryId}));
  }
}
