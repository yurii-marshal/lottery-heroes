import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-tickets-page-mobile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tickets-page-mobile.component.html',
})
export class TicketsPageMobileComponent {
  @Input() lotteryId$: Observable<string>;
  @Input() device$: Observable<string>;
}
