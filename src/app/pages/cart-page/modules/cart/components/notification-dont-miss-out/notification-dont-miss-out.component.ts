import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AltService } from '../../../../../../services/lotteries/alt.service';

@Component({
  selector: 'app-notification-dont-miss-out',
  templateUrl: './notification-dont-miss-out.component.html',
  styleUrls: ['./notification-dont-miss-out.component.scss']
})
export class NotificationDontMissOutComponent implements OnChanges {

  @Input() data: { lotteryId: string, linesToOffer: number };
  @Output() close = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() addLinesToGetFree = new EventEmitter<string>();

  altName: string;

  constructor(private altService: AltService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      this.altName = this.altService.getAlt(this.data.lotteryId);
    }
  }
}
