import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';

import { SyndicatePageState } from '../../store/reducers';
import { SyndicatePageAddToCartAction } from '../../store/actions/syndicate-page.actions';
import { getSharesEntities } from '../../store/selectors/syndicate-page.selectors';

@Component({
  selector: 'app-syndicate-total-desktop-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-syndicate-total-desktop
      [syndicateModel]="syndicateModel"
      [sharesAmount]="sharesAmount$|async"
      (addToCartEvent)="onAddToCartEvent($event)"
    ></app-syndicate-total-desktop>
  `
})

export class SyndicateTotalDesktopContainerComponent implements OnInit {
  @Input() syndicateModel: SyndicateModel;

  sharesAmount$: Observable<number>;

  constructor(private store: Store<SyndicatePageState>) {
  }

  ngOnInit(): void {
    this.sharesAmount$ = this.store.select(getSharesEntities)
      .pipe(
        map(sharesEntities => sharesEntities[this.syndicateModel.lotteryId])
      );
  }

  onAddToCartEvent(event: {templateId: number, lotteryId: string; sharesAmount: number}): void {
    this.store.dispatch(new SyndicatePageAddToCartAction(event));
  }
}
