import { Component, OnDestroy, OnInit } from '@angular/core';
import { LightboxesService } from '../../services/lightboxes.service';
import { LightboxDataButtonInterface, LightboxDataInterface } from '../../interfaces/lightbox-data.interface';
import { CurrencyService } from '../../../../services/auth/currency.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { LuvDepositLimitInterface } from '../../../../services/api/entities/incoming/luv/luv-deposit-limit.interface';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-deposit-limit-lightbox',
  templateUrl: './deposit-limit-lightbox.html',
  styleUrls: ['./deposit-limit-lightbox.scss']
})
export class DepositLimitLightboxComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private lightboxName = 'deposit-limit';
  isShowlightbox = false;
  isShowButtons = false;
  data: LightboxDataInterface;
  currencyId: string;
  depositLimitForm: FormGroup;
  depositLimitsConfig: LuvDepositLimitInterface[];
  defaultLimitValue = 50000;
  checkedLimit: LuvDepositLimitInterface;
  savedLimitObj = {};

  constructor(private lightboxesService: LightboxesService,
              private currencyService: CurrencyService,
              private formBuilder: FormBuilder) {
    lightboxesService.getShowEventEmitter()
      .filter((data: LightboxDataInterface) => data.type === this.lightboxName)
      .subscribe((data: LightboxDataInterface) => this.showLightbox(data));
    lightboxesService.getCloseAllEventEmitter()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => this.closeLightbox());
    this.currencyService.getCurrencyId()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(res => this.currencyId = res);
  }

  ngOnInit() {
    this.buildForm({});
  }

  private buildForm({amount = this.defaultLimitValue, type = 'Daily'}) {
    this.depositLimitForm = this.formBuilder.group({
      'amount': [amount, [Validators.required, Validators.pattern(/^[0-9]+((.[0-9]{1,2})|\.)?$/)]],
      'type': [type].toString(),
    });
  }

  showLightbox(data: LightboxDataInterface) {
    this.getDepositLimits(data.payload);
    this.isShowButtons = (('buttons' in data) && data.buttons.length > 0);
    this.data = data;
    this.isShowlightbox = true;
  }

  closeLightbox() {
    this.isShowlightbox = false;
    if (this.data && ('closeHandler' in this.data)) {
      this.data.closeHandler();
    }
    this.buildForm(this.savedLimitObj);
  }

  clickBtn(btnInfo: LightboxDataButtonInterface) {
    if ('handler' in btnInfo) {
      this.validateInputLimit();
      if (this.depositLimitForm.valid) {
        this.isShowlightbox = false;
        const formValue = this.depositLimitForm.value;
        btnInfo.handler(formValue);
        this.saveDepositLimitObj(this.depositLimitForm.value);
      }
    }
  }

  private getDepositLimits(depositLimits$: Observable<LuvDepositLimitInterface[]>) {
    depositLimits$
      .takeUntil(this.ngUnsubscribe)
      .subscribe(config => {
          this.depositLimitsConfig = config;
          this.checkedLimit = config[0];
        }
      );
  }

  onChangeRadio(limitObj) {
    this.checkedLimit = limitObj;
  }

  onInput() {
    this.depositLimitForm.controls['amount'].setErrors(null);
  }

  private validateInputLimit() {
    this.depositLimitForm.controls['amount'].markAsTouched();
    const limitValue = this.depositLimitForm.value['amount'];
    if (limitValue === null || limitValue === '' || +limitValue < this.checkedLimit.min_value) {
      this.depositLimitForm.controls['amount'].setErrors({'incorrect': true});
    }
  }

  private saveDepositLimitObj(obj) {
    this.savedLimitObj = obj;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
