import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DeviceType } from '../../../../../services/device/entities/types/device.type';
import { DeviceService } from '../../../../../services/device/device.service';
import { ActivatedRoute, Data } from '@angular/router';
import { BrandQueryService } from '@libs/biglotteryowin-core/services/queries/brand-query.service';
import { AuthService } from '../../../../../services/auth/auth.service';

@Component({
  selector: 'app-results-lottery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './results-lottery.component.html',
  styleUrls: ['./results-lottery.component.scss']
})
export class ResultsLotteryComponent implements OnInit {
  device$: Observable<DeviceType>;
  lotteryId$: Observable<string>;

  constructor(private deviceService: DeviceService,
              private brandQueryService: BrandQueryService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.device$ = this.deviceService.getDevice();
    this.lotteryId$ = this.activatedRoute.data
      .map((data: Data) => data['lotteryId'])
      .map((lotteryId: string) => {
        if (lotteryId === 'euromillions' && this.brandQueryService.getBrandId() !== 'BIGLOTTERYOWIN_UK') {
          return 'euromillions-ie';
        }

        return lotteryId;
      });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

}
