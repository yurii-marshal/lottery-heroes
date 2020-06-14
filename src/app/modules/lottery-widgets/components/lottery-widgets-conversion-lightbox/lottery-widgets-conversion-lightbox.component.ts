import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { LotteryInterface } from '../../../api/entities/incoming/lotteries/lotteries.interface';
import { SyndicateModel } from '@libs/biglotteryowin-core/models/syndicate.model';

@Component({
  selector: 'app-lottery-widgets-conversion-lightbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lottery-widgets-conversion-lightbox.component.html',
  styleUrls: ['./lottery-widgets-conversion-lightbox.component.scss']
})
export class LotteryWidgetsConversionLightboxComponent implements OnInit {
  @Input() soldLottery: LotteryInterface | SyndicateModel;
  @Input() lotteryId: string;
  @Input() country: string;
  @Input() lotterySlug: string;

  @Output() show = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() goToPlay = new EventEmitter();

  isConversionLightBoxShown = false;
  time = 10000;
  lotteryName: string;
  lotteryLogo: string;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private zone: NgZone) { }

  ngOnInit() {
    this.lotteryName = this.soldLottery instanceof SyndicateModel ? this.soldLottery['lotteryName'] : this.soldLottery['name'];
    this.lotteryLogo = this.soldLottery instanceof SyndicateModel ? this.soldLottery['lotteryLogo'] : this.soldLottery['logo'];

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          this.isConversionLightBoxShown = true;
          this.show.emit({show: this.isConversionLightBoxShown, lotteryName: this.lotteryName});
          this.changeDetectorRef.markForCheck();
        });
      }, this.time);
    });
  }

  closeConversionLightBox() {
    this.isConversionLightBoxShown = false;
    this.close.emit(this.lotteryName);
  }

  cancelConversionLightBox() {
    this.isConversionLightBoxShown = false;
    this.cancel.emit(this.lotteryName);
  }

}
