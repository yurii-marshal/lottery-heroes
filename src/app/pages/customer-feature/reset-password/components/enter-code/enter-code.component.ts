import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../services/auth/auth.service';
import { EqualPasswordsValidator } from '../../../../../modules/shared/validators/equal-passwords.validator';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-enter-code',
  templateUrl: './enter-code.component.html',
  styleUrls: ['./enter-code.component.scss']
})
export class EnterCodeComponent implements OnInit {
  enterCodePassword: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              @Inject(DOCUMENT) private document,
              private router: Router,
              private zone: NgZone) {
  }

  ngOnInit() {
    this.validationForm();
  }

  private validationForm() {
    this.enterCodePassword = this.formBuilder.group({
      'enterCode': ['', [Validators.required]],
      'enterCodeNewPassword': ['', [Validators.required, Validators.minLength(6)]],
      'enterCodeRepeatPassword': ['', [Validators.required, Validators.minLength(6)]]
    }, {validator: EqualPasswordsValidator.validate('enterCodeNewPassword', 'enterCodeRepeatPassword')});
  }

  onSubmit() {
    this.clearAllMsg();

    const form = this.enterCodePassword.value;
    this.authService.passwordReset({
      'password_reset_code': form.enterCode,
      'new_password': form.enterCodeNewPassword
    }).subscribe(
      data => this.showSuccessMsg(),
      error => this.showErrorMsg(error.json())
    );
  }

  showErrorMsg(error) {
    const spanMsg = this.document.querySelector('#enterCodePasswordErrorMsg');
    spanMsg.innerHTML = error.message;
  }

  showSuccessMsg() {
    const spanMsg = this.document.querySelector('#enterCodePasswordSuccessMsg');
    spanMsg.innerHTML = 'Password successfully changed';
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          this.router.navigate(['signup']);
        });
      }, 1500);
    });
  }

  clearAllMsg() {
    const spanError = this.document.querySelector('#enterCodePasswordErrorMsg');
    spanError.innerHTML = '';
    const spanSuccess = this.document.querySelector('#enterCodePasswordSuccessMsg');
    spanSuccess.innerHTML = '';
  }
}
