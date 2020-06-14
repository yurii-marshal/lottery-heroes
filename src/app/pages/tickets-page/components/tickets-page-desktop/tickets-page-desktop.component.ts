import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-tickets-page-desktop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tickets-page-desktop.component.html',
})
export class TicketsPageDesktopComponent {
  @Input() lotteryId$: Observable<string>;
  @Input() device$: Observable<string>;
}
