import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { LotteryInterface } from '../../../../api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../../api/entities/incoming/lotteries/draws.interface';

@Component({
  selector: 'app-lotteries-menu-list-item-mobile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lotteries-menu-list-item-mobile.component.html',
  styleUrls: ['./lotteries-menu-list-item-mobile.component.scss'],
})
export class LotteriesMenuListItemMobileComponent {
  @Input() lottery: LotteryInterface;
  @Input() upcomingDraw: DrawInterface;
  @Input() lotterySlug: string;
}
