import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { Store } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { Observable } from 'rxjs/Observable';
import { first, map, pluck, switchMap, tap } from 'rxjs/operators';

import { getRouterStateUrl, RouterStateUrl } from '@libs/router-store/reducers';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';
import { SyndicatesQueryService } from '@libs/biglotteryowin-core/services/queries/syndicates-query.service';

import { DeviceService } from '../../services/device/device.service';
import { DeviceType } from '../../services/device/entities/types/device.type';
import { MetaService } from '../../modules/meta/services/meta.service';
import { SyndicatePageLoadedAction } from './store/actions/syndicate-page.actions';
import { SyndicatesLoadAction } from '@libs/biglotteryowin-core/store/actions/syndicates.actions';

@Component({
  selector: 'app-syndicate-page-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="syndicateModel$|async">
      <app-syndicate-desktop-page
        *ngIf="(device$|async) === 'desktop'"
        class="hidden-sm-down"
        [syndicateModel]="syndicateModel$|async"
      ></app-syndicate-desktop-page>

      <app-syndicate-mobile-page
        *ngIf="(device$|async) === 'mobile'"
        class="hidden-md-up"
        [syndicateModel]="syndicateModel$|async"
      ></app-syndicate-mobile-page>
    </ng-container>
  `
})

export class SyndicatePageContainerComponent implements OnInit {
  syndicateModel$: Observable<SyndicateModel>;
  device$: Observable<DeviceType>;

  constructor(private store: Store<RouterReducerState<RouterStateUrl>>,
              private deviceService: DeviceService,
              private syndicatesQueryService: SyndicatesQueryService,
              private metaService: MetaService) {
    this.syndicateModel$ = this.store.select(getRouterStateUrl).pipe(
      pluck('data'),
      map((data: Data) => data['lotteryId']),
      tap((lotteryId: string) => this.metaService.setFromConfig('lotteries', lotteryId)),
      switchMap((lotteryId: string) =>
        this.syndicatesQueryService.getSyndicateModelByLotteryId(lotteryId)),
    );

    this.device$ = this.deviceService.getDevice();
  }

  ngOnInit(): void {
    this.store.dispatch(new SyndicatesLoadAction());

    this.syndicateModel$
      .pipe(
        first()
      )
      .subscribe((syndicateModel) => {
        this.store.dispatch(new SyndicatePageLoadedAction({
          sharesAmount: syndicateModel.numSharesAvailable
        }));
      });
  }
}
