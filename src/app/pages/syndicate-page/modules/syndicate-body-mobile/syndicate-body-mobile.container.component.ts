import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';

import { SyndicatePageState } from '../../store/reducers';
import {
  SyndicatePageAddSharesAction,
  SyndicatePageRemoveSharesAction,
  SyndicatePageShowLinesAction, SyndicatePageSetSharesAction
} from '../../store/actions/syndicate-page.actions';
import { Observable } from 'rxjs/Observable';
import { getSharesEntities } from '../../store/selectors/syndicate-page.selectors';
import { filter, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-syndicate-body-mobile-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-syndicate-body-mobile
      [syndicateModel]="syndicateModel"
      [sharesAmount]="sharesAmount$ | async"
      (addShareEvent)="onAddShareEvent($event)"
      (removeShareEvent)="onRemoveShareEvent($event)"
      (viewLinesEvent)="onViewLinesEvent($event)"
    ></app-syndicate-body-mobile>
  `
})

export class SyndicateBodyMobileContainerComponent implements OnInit {
  @Input() syndicateModel: SyndicateModel;

  sharesAmount$: Observable<number>;

  constructor(private store: Store<SyndicatePageState>) {
  }

  ngOnInit(): void {
    this.sharesAmount$ = this.store.select(getSharesEntities)
      .pipe(
        map(sharesEntities => sharesEntities[this.syndicateModel.lotteryId]),
        tap((sharesAmount: number) => {
          if (typeof sharesAmount === 'undefined') {
            this.store.dispatch(new SyndicatePageSetSharesAction({
              lotteryId: this.syndicateModel.lotteryId,
              sharesAmount: 2
            }));
          }
        }),
        filter((sharesAmount: number) => sharesAmount > 0)
      );
  }

  onRemoveShareEvent(event: {lotteryId: string, sharesAmount: number, sharesBeforeClick: number}): void {
    this.store.dispatch(new SyndicatePageRemoveSharesAction({
      lotteryId: event.lotteryId,
      sharesAmount: event.sharesAmount,
      sharesBeforeClick: event.sharesBeforeClick
    }));
  }

  onAddShareEvent(event: {lotteryId: string, sharesAmount: number, sharesBeforeClick: number}): void {
    this.store.dispatch(new SyndicatePageAddSharesAction({
      lotteryId: event.lotteryId,
      sharesAmount: event.sharesAmount,
      sharesBeforeClick: event.sharesBeforeClick
    }));
  }

  onViewLinesEvent(event: {
    lotteryName: string, lines: Array<{
      mainNumbers: number[],
      extraNumbers: number[],
      perticketNumbers: number[],
    }>
  }): void {
    this.store.dispatch(new SyndicatePageShowLinesAction(event));
  }
}
