import { Component, OnInit, Output, EventEmitter, OnDestroy, PLATFORM_ID, Inject, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth/auth.service';
import { EmailValidator } from '../../../shared/validators/email.validator';
import { GlobalService } from '../../../../services/global.service';
import { isPlatformBrowser } from '@angular/common';
import { BrandTranslateService } from '../../../brand/services/brand-translate.service';
import { AnalyticsDeprecatedService } from '../../../analytics-deprecated/services/analytics-deprecated.service';
import { PasswordValidator } from '../../../shared/validators/password.validator';
import { BrandParamsService } from '../../../brand/services/brand-params.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit, OnDestroy {
  @Output() successSignin = new EventEmitter();
  @Output() showAnotherComponent = new EventEmitter<string>();
  @Output() placeEmail = new EventEmitter<string>();
  errorObj = {};
  signinForm: FormGroup;
  formSubscription;
  passwordValidatorConfig;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private globalService: GlobalService,
              private brandTranslateService: BrandTranslateService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private brandParamsService: BrandParamsService,
              private zone: NgZone) {
  }

  ngOnInit() {
    this.brandParamsService.getConfig('passwordValidator').subscribe(
      config => {
        this.passwordValidatorConfig = config;
        this.buildForm();
      }
    );
    this.formSubscription = this.signinForm.valueChanges.subscribe(data => {
      this.clearErrorMessages();
    });
  }

  buildForm() {
    this.signinForm = this.formBuilder.group({
      'email': ['', [Validators.required, EmailValidator.validate]],
      'password': ['', Validators.compose([Validators.required, PasswordValidator.validate(this.passwordValidatorConfig)])],
    });
  }

  onSubmit() {
    this.signinForm.controls['email'].markAsTouched();
    this.signinForm.controls['password'].markAsTouched();
    if (this.signinForm.valid) {
      this.authService.signin(this.signinForm.value).subscribe(
        user => this.signinSuccees(user),
        error => this.signinError(error)
      );
    }
  }

  signinSuccees(user) {
    this.successSignin.emit();
    this.clearForm();
    this.showLimitedLightBox(user);
  }

  showLimitedLightBox(user) {
    if (isPlatformBrowser(this.platformId) && (user.status_id === 'limited' || user.status_id === 'unverified')) {
      this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          this.zone.run(() => {
            switch (user.status_id) {
              case 'limited':
                this.globalService.showLightbox$.emit({name: 'limited-status', value: 'afterAuth'});
                break;
              case 'unverified':
                this.globalService.showLightbox$.emit({name: 'account-unverified', value: 'not verified'});
            }
          });
        }, 500);
      });
    }
  }

  signinError(error) {
    console.log(error);
    if (error.details) {
        switch (error.details.code) {
            case 'self_excluded':
                this.showNewComponent('status-self-excluded');
                break;
            case 'blocked':
                this.showNewComponent('status-blocked');
                break;
            case 'closed':
                this.showNewComponent('status-closed');
                break;
            case 'forbidden_country':
                this.showNewComponent('login-forbidden-country');
                break;
            default:
                this.errorObj = this.brandTranslateService.createErrorObj(error, 'email');
                break;
        }
    }
  }

  isErrorField(fieldName: string) {
    return fieldName in this.errorObj;
  }

  showPassword(input) {
    input.type = input.type === 'text' ? 'password' : 'text';
  }

  showNewComponent(name: string) {
    this.placeEmail.emit(this.signinForm.controls['email'].value);
    this.showAnotherComponent.emit(name);
    this.clearForm();
  }

  clearForm() {
    this.buildForm();
    this.clearErrorMessages();
  }

  clearErrorMessages() {
    this.errorObj = {};
  }

  onTrackLogInClicked(label: string) {
    this.analyticsDeprecatedService.trackLogInClicked(label);
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

}
