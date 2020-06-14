import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { BrandParamsService } from '../../../../../modules/brand/services/brand-params.service';
import { ContactUsApiService } from '../../../../../modules/api/contact-us.api.service';

@Component({
  selector: 'app-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  contactForm: FormGroup;
  submitted = false;
  submitMsg: string;
  statusCode: string;
  brandId: string;

  constructor(private formBuilder: FormBuilder,
              private contactUsApiService: ContactUsApiService,
              private changeDetectorRef: ChangeDetectorRef,
              private brandParamsService: BrandParamsService) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.contactForm = this.formBuilder.group({
      'email': ['', [this.emailFormatValidator.bind(this)]],
      'subject': ['', Validators.required],
      'message': [''],
      'brand_id': [this.brandParamsService.getBrandId()],
    });
  }

  emailFormatValidator(control: FormControl): {
    required?: boolean,
    wrongFormat?: boolean,
  } {
    const EMAIL_REGEXP = new RegExp(['^(([^<>()\\[\\]\\\\.,;:\\s@\ "]+(\\.[^<>(),[\\]\\\\.,;:\\s@\"]+)*)',
      '|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.',
      '[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\\.)+',
      '[a-zA-Z]{2,}))$'].join(''));

    if (control.value === '' ) {
      return {required: true};
    }
    if (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value)) {
      return {wrongFormat: true};
    }
    return null;
  }

  onSubmit() {
    this.contactForm.controls['email'].markAsTouched();
    this.contactForm.controls['subject'].markAsTouched();

    if ( this.contactForm.valid ) {
      this.contactUsApiService.sendContactForm(this.contactForm.value).subscribe(
        letterObj => this.submitSuccees(letterObj),
        error => this.submitError(error),
      );
    }
  }

  submitSuccees(response) {
    if ( response.success ) {
      this.submitted = true;
      this.submitMsg = 'Your message has been sent successfully';
      this.changeDetectorRef.markForCheck();
    }
  }

  submitError(error) {
    this.submitted = true;
    this.submitMsg = error.error;
    this.statusCode = 'error';
    this.changeDetectorRef.markForCheck();
  }
}
