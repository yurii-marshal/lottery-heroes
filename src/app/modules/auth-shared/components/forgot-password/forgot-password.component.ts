import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth/auth.service';
import { EmailValidator } from '../../../shared/validators/email.validator';
import { BrandTranslateService } from '../../../brand/services/brand-translate.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  @Output() saveEmail = new EventEmitter<String>();
  @Output() showAnotherComponent = new EventEmitter<String>();
  @Input() placeEmailValue;
  errorObj = {};
  forgotPasswordForm: FormGroup;

  private aliveSubscriptions = true;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private brandTranslateService: BrandTranslateService) { }

  ngOnInit() {
    this.buildForm();
    this.forgotPasswordForm.valueChanges.takeWhile(() => this.aliveSubscriptions).subscribe(data => {
      this.clearErrorMessages();
    });

    this.placeEmailValue.takeWhile(() => this.aliveSubscriptions).subscribe(
      data => this.forgotPasswordForm.controls['email'].setValue(data)
    );
  }

  buildForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      'email': ['', [Validators.required, EmailValidator.validate]]
    });
  }

  onSubmit() {
    this.forgotPasswordForm.controls['email'].markAsTouched();
    if (this.forgotPasswordForm.valid) {
      this.authService.passwordResetInit(this.forgotPasswordForm.value).subscribe(
        response => this.onSuccessReset(response),
        error => this.onErrorReset(error)
      );
    }
  }

  onSuccessReset(response) {
    this.saveEmail.emit(this.forgotPasswordForm.value.email);
    this.showNewComponent('email-sent-success');
  }

  onErrorReset(response) {
   this.errorObj = this.brandTranslateService.createErrorObj(response, 'email');
  }

  isErrorField(fieldName: string) {
    return fieldName in this.errorObj;
  }

  showNewComponent(name: string) {
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

  ngOnDestroy() {
    this.aliveSubscriptions = false;
  }
}
