import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-lotteries-menu-list-mobile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lotteries-menu-list-mobile.component.html',
  styleUrls: ['./lotteries-menu-list-mobile.component.scss']
})
export class LotteriesMenuListMobileComponent {
  @Input() lotteryIds: Array<string>;
}
