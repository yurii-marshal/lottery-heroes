import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-results-menu-list-mobile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './results-menu-list-mobile.component.html',
  styleUrls: ['./results-menu-list-mobile.component.scss']
})
export class ResultsMenuListMobileComponent {
  @Input() lotteryIds: Array<string>;
}
