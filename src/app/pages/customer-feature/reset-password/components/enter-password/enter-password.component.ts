import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, NgZone } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../services/auth/auth.service';
import { EqualPasswordsValidator } from '../../../../../modules/shared/validators/equal-passwords.validator';
import { GlobalService } from '../../../../../services/global.service';
import { isPlatformBrowser } from '@angular/common';
import { PasswordValidator } from '../../../../../modules/shared/validators/password.validator';
import { BrandParamsService } from '../../../../../modules/brand/services/brand-params.service';

@Component({
  selector: 'app-enter-password',
  templateUrl: './enter-password.component.html',
  styleUrls: ['./enter-password.component.scss']
})
export class EnterPasswordComponent implements OnInit, OnDestroy {
  enterPassword: FormGroup;
  passErrorMsg: string;
  passSuccessMsg: string;
  private subscription: Subscription;
  private codeNumber: number;
  formSubscription: Subscription;
  passwordValidatorConfig;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private globalService: GlobalService,
              private brandParamsService: BrandParamsService,
              private zone: NgZone) {
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        this.codeNumber = params['code'];
      }
    );
    this.brandParamsService.getConfig('passwordValidator').subscribe(
      config => {
        this.passwordValidatorConfig = config;
        this.validationForm();
        this.formSubscription = this.enterPassword.valueChanges.subscribe(data => {
          this.enterPassword.controls['enterRepeatPassword'].markAsTouched();
          this.passErrorMsg = '';
        });
      }
    );
  }

  validationForm() {
    this.enterPassword = this.formBuilder.group({
      'enterNewPassword': ['', [Validators.required, PasswordValidator.validate(this.passwordValidatorConfig)]],
      'enterRepeatPassword': ['', [Validators.required]]
    }, {validator: EqualPasswordsValidator.validate('enterNewPassword', 'enterRepeatPassword')});
  }

  onSubmit() {
    this.enterPassword.controls['enterNewPassword'].markAsTouched();
    if (this.enterPassword.valid) {
      const form = this.enterPassword.value;
      this.authService.passwordReset({
        'password_reset_code': this.codeNumber,
        'new_password': form.enterNewPassword
      }).subscribe(
        data => {
          this.showSuccessMsg();
          this.showSuccessModal();
        },
        error => this.showErrorMsg(error),
      );
    }
  }

  showErrorMsg(error) {
    this.passErrorMsg = error.message;
  }

  showPassword(input) {
    input.type = input.type === 'text' ? 'password' : 'text';
  }

  showSuccessMsg() {
    const newPassword = this.enterPassword.controls['enterNewPassword'].value;
    let email: string;

    this.passSuccessMsg = 'Password successfully changed';
    this.route.queryParams.subscribe(params => email = params['email']);
    this.authService.signin({email: email, password: newPassword})
      .subscribe(
        data => {
          this.zone.runOutsideAngular(() => {
            setTimeout(() => {
              this.zone.run(() => {
                this.router.navigate(['/']);
              });
            }, 2000);
          });
        },
        error => console.log(error)
      );
  }

  showSuccessModal() {
    if (isPlatformBrowser(this.platformId)) {
      this.globalService.showLightbox$.emit({name: 'password-update-successfully', value: ''});
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.formSubscription.unsubscribe();
  }
}
