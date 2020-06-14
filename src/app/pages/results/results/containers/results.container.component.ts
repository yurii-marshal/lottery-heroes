import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LotteriesSortService } from '../../../../services/lotteries/lotteries-sort.service';
import { MetaService } from '../../../../modules/meta/services/meta.service';

@Component({
  selector: 'app-results-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-results
    [lotteriesOrder]="lotteriesOrder$|async"
  ></app-results>`
})
export class ResultsContainerComponent implements OnInit {
  lotteriesOrder$: Observable<string[]>;

  constructor(private lotteriesSortService: LotteriesSortService,
              private metaService: MetaService) {
  }

  ngOnInit(): void {
    this.lotteriesOrder$ = this.lotteriesSortService.getLotteriesIdsSortedList('latest', true, 'datedesc');
    this.metaService.setFromConfig('page', 'results');
  }
}
