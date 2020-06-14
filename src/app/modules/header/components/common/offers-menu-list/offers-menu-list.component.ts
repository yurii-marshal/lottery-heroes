import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-offers-menu-list',
  templateUrl: './offers-menu-list.component.html',
  styleUrls: ['./offers-menu-list.component.scss']
})
export class OffersMenuListComponent implements OnChanges {
  @Input() lotteryIds: Array<string>;

  dropdownClass: string;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.lotteryIds.currentValue) {
      switch (changes.lotteryIds.currentValue.length) {
        case 1:
          this.dropdownClass = 'offer-1';
          break;
        case 2:
          this.dropdownClass = 'offers-2';
          break;
        case 3:
          this.dropdownClass = 'offers-3';
          break;
        case 4:
          this.dropdownClass = 'offers-4';
          break;
        default:
          this.dropdownClass = 'offers-default';
          break;
      }
    }
  }

}
