import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { OfferFreeLinesInterface } from '../../../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import { LineInterface } from '../../../../../../modules/api/entities/outgoing/common/line.interface';

@Component({
  selector: 'app-free-tickets-banner-mobile',
  templateUrl: './free-tickets-banner-mobile.component.html',
  styleUrls: ['./free-tickets-banner-mobile.component.scss']
})
export class FreeTicketsBannerMobileComponent implements OnInit {
  @Input() freeLinesOffers: OfferFreeLinesInterface;
  @Input() nonFreeFilledLines$: Observable<LineInterface[]>;

  @Output() autoselectForFreeLineEvent = new EventEmitter<void>();

  freeLinesNumber: number;

  ngOnInit() {
    this.nonFreeFilledLines$.subscribe(lines => {
      const nonFree = lines.length;
      const linesToQualify = this.freeLinesOffers.details.lines_to_qualify;

      if (nonFree < linesToQualify || nonFree % linesToQualify !== 0) {
        this.freeLinesNumber = linesToQualify - (nonFree % linesToQualify);
      } else {
        this.freeLinesNumber = linesToQualify;
      }
    });
  }
}
