import { Component, OnDestroy, OnInit } from '@angular/core';
import { MetaService } from '../../../modules/meta/services/meta.service';
import { LotteryNotificationService } from '../../../services/lotteries/entities/lottery-notification.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AltService } from '../../../services/lotteries/alt.service';
import { LotteriesService } from '../../../services/lotteries/lotteries.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-lottery-notification-unsubscribe',
  templateUrl: './lottery-notification-unsubscribe.component.html',
  styleUrls: ['./lottery-notification-unsubscribe.component.scss']
})
export class LotteryNotificationUnsubscribeComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  lotteryId: string;
  lotteryName: string;
  isShowContent: boolean;
  lotterySlug$: Observable<string>;

  constructor(private altService: AltService,
              private metaService: MetaService,
              private lotteryNotificationService: LotteryNotificationService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private lotteriesService: LotteriesService) {
    metaService.setFromConfig('page', 'lottery-notification-unsubscribe');
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe((params: Params) => {
      const token = params['code'];
      this.lotteryNotificationService.confirmUnSubscription({token: token})
        .subscribe((data) => {
            this.lotteryId = data['subscription_details']['lottery_id'];
            this.lotteryName = this.altService.getAlt(this.lotteryId);
            this.isShowContent = true;
          },
          (error) => {
            if (error.statusCode !== 200) {
              this.isShowContent = false;
              this.router.navigate(['/404']);
            }
        });
    });

   this.lotterySlug$ = this.lotteriesService.getSlug(this.lotteryId);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
