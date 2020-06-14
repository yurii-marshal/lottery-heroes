import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-offers-menu-list-mobile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './offers-menu-list-mobile.component.html',
  styleUrls: ['./offers-menu-list-mobile.component.scss']
})
export class OffersMenuListMobileComponent {
  @Input() lotteryIds: Array<string>;
}
