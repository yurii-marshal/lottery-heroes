import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LotteriesService } from '../../../services/lotteries/lotteries.service';
import { LotteriesSortService } from '../../../services/lotteries/lotteries-sort.service';

import { LotteriesMapInterface } from '../../../services/lotteries/entities/interfaces/lotteries-map.interface';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-your-numbers-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-check-your-numbers
      [lotteryIds]="lotteryIds$|async"
      [lotteriesMap]="lotteriesMap$|async"
      (goToRoute)="goToRoute($event)"
    ></app-check-your-numbers>
  `,
})
export class CheckYourNumbersContainerComponent implements OnInit {
  lotteryIds$: Observable<string[]>;
  lotteriesMap$: Observable<LotteriesMapInterface>;

  constructor(private lotteriesSortService: LotteriesSortService,
              private lotteriesService: LotteriesService,
              private router: Router) {
  }

  ngOnInit() {
    this.lotteryIds$ = this.lotteriesSortService.getLotteriesIdsSortedList('latest');
    this.lotteriesMap$ = this.lotteriesService.getLotteriesMap();
  }

  goToRoute(lotteryId: string): void {
    if (lotteryId) {
      this.lotteriesService.getSlug(lotteryId)
        .pipe(
          first()
        )
        .subscribe((slug: string) => {
          this.router.navigate(['/', slug, 'results']);
        });
    } else {
      this.router.navigate(['/lotteries/results']);
    }
  }
}
