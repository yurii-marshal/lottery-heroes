import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator } from '../../../shared/validators/email.validator';
import { LightboxesService } from '../../../lightboxes/services/lightboxes.service';
import { LotteryNotificationService } from '../../../../services/lotteries/entities/lottery-notification.service';
import { BrandParamsService } from '../../../brand/services/brand-params.service';
import { LotteryInterface } from '../../../api/entities/incoming/lotteries/lotteries.interface';

@Component({
  selector: 'app-lottery-widgets-notification',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lottery-widgets-notification.component.html',
  styleUrls: ['./lottery-widgets-notification.component.scss']
})
export class LotteryWidgetsNotificationComponent implements OnInit {
  @Input() isInAside: boolean;
  @Input() lottery: LotteryInterface;

  isSubmited = false;
  notificationForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private brandParamsService: BrandParamsService,
              private lightboxesService: LightboxesService,
              private lotteryNotificationService: LotteryNotificationService,
              private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.notificationForm = this.formBuilder.group({
      'email': ['', [Validators.required, EmailValidator.validate]]
    });
  }

  onSubmit() {
    const lotteryId = this.lottery.id;
    const email = this.notificationForm.controls['email'].value;
    const brandId = this.brandParamsService.getBrandId();

    this.isSubmited = true;
    if (this.notificationForm.valid) {
      this.lotteryNotificationService.sendNotificationForm({lottery_id: lotteryId, email: email, brand_id: brandId})
        .subscribe(
          response => {
            if (response.code === 200) {
              this.showLightBox();
            }
          },
          error => {
            this.notificationForm.controls['email'].setErrors({'required': true});
            this.changeDetectorRef.markForCheck();
          }
        );
    }
  }

  showLightBox() {
    this.lightboxesService.show({
      type: 'general',
      message: 'A confirmation email was sent to your inbox. Check it out and click on the attached link to get things rolling!',
      buttons: [
        {
          text: 'Ok',
          type: 'save',
          handler: () => { this.notificationForm.reset(); }
        }
      ]
    });
  }

}
