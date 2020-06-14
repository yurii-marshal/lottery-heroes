import {Component, OnInit, Output, EventEmitter, OnDestroy, Input, ElementRef, NgZone, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../../../services/auth/auth.service';
import { EmailValidator } from '../../../shared/validators/email.validator';
import { LuvService } from '../../../../services/luv.service';
import { LuvCountryInterface } from '../../../../services/api/entities/incoming/luv/luv-countries.interface';
import { AnalyticsDeprecatedService } from '../../../analytics-deprecated/services/analytics-deprecated.service';
import { VisitorCountryInterface } from '../../../../services/api/entities/incoming/visitor-country.interface';
import { BrandTranslateService } from '../../../brand/services/brand-translate.service';
import { CurrencyService } from '../../../../services/auth/currency.service';
import { ScrollService } from '../../../../services/device/scroll.service';
import { DeviceService } from '../../../../services/device/device.service';
import { WebStorageService } from '../../../../services/storage/web-storage.service';
import { BrandParamsService } from '../../../brand/services/brand-params.service';
import { PasswordValidator } from '../../../shared/validators/password.validator';
import { IOption } from 'ng-select';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../store/reducers/index';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() label;
  @Input() btnSubmitText;
  @Output() showAnotherComponent = new EventEmitter<string>();
  @Output() successSignin = new EventEmitter();
  @Output() checkIsAccountUnverified = new EventEmitter();

  @ViewChild('ac1') ac1: ElementRef;
  @ViewChild('ac2') ac2: ElementRef;

  errorObj = {};
  signupForm: FormGroup;
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  daysCounter = new Array(31);
  yearsCounter = new Array(new Date().getFullYear() - 1917 - 17);
  countries: any;
  isUnitedKingdom = false;
  isShowFuulAddress = true;
  isShowPostcodeSearch = false;
  listAddress;
  siteCurrencySymbol$;
  limitedAge = 18;
  limitAddressLength = 120;
  sessionFormValues = {};
  device: string;
  passwordValidatorConfig;
  brandId: string;

  errorForGA = {
    email : false,
    password : false,
    firstname : false,
    lastname : false,
    address : false,
    city : false,
    zip : false,
    depositLimit : false,
  };

  // ng-select
  optionsListDay: Array<IOption> = [];
  optionsListMonth: Array<IOption> = [];
  optionsListYear: Array<IOption> = [];
  optionsListCountries: Array<IOption> = [];
  optionsListAddress: Array<IOption> = [];
  selectedDay: string;
  selectedMonth: string;
  selectedYear: string;
  selectedCountry: string;

  isTermsAccepted: boolean;

  constructor(private store: Store<fromRoot.State>,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private currencyService: CurrencyService,
              private luvService: LuvService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService,
              private brandTranslateService: BrandTranslateService,
              private deviceService: DeviceService,
              private scrollService: ScrollService,
              private elementRef: ElementRef,
              private webStorageService: WebStorageService,
              private brandParamsService: BrandParamsService,
              private zone: NgZone) {
    this.brandId = this.brandParamsService.getBrandId();
  }

  ngOnInit() {
    this.loadSessionFormValues();
    this.brandParamsService.getConfig('passwordValidator').subscribe(
      config => {
        this.passwordValidatorConfig = config;
        this.buildForm(this.sessionFormValues);
      }
    );

    this.luvService.getCountriesBrand()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((countries: Array<LuvCountryInterface>) => {
        this.countries = countries
          .sort((c1: LuvCountryInterface, c2: LuvCountryInterface) => {
            const a = c1.name.toLowerCase();
            const b = c2.name.toLowerCase();
            if (a < b) {
              return -1;
            }
            if (a > b) {
              return 1;
            }
            return 0;
          });
        this.setDefaultCountry();
        this.createCountriesSelect();
      });

    this.siteCurrencySymbol$ = this.currencyService.getCurrencySymbol();
    this.signupForm.valueChanges
      .takeUntil(this.ngUnsubscribe)
      .subscribe(data => this.clearErrorMessages());
    this.deviceService.getDevice()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((device) => this.device = device);
  }

  createCountriesSelect() {
    const tempCountriesArray = [];
    for (let i = 0; i < this.countries.length; i++) {
      tempCountriesArray.push({
        value: this.countries[i].name,
        label: this.countries[i].name
      });
    }
    this.optionsListCountries = tempCountriesArray;
  }

  loadSessionFormValues() {
    const sessionValues = this.webStorageService.getItem('signup-form', 'sessionStorage');
    if (sessionValues) {
      this.sessionFormValues = sessionValues;
    }
  }

  buildForm({
              email = '',
              first_name = '',
              last_name = '',
              dayOfBirth = 1,
              monthOfBirth = 8,
              yearOfBirth = 1950,
              age = this.limitedAge,
              country = '',
              country_id = '',
              address = '',
              city = '',
              zip = '',
              britishPostcode = '',
              britishAddress = '',
            }) {
    this.signupForm = this.formBuilder.group({
      'email': [email, [Validators.required, EmailValidator.validate]],
      'password': ['', Validators.compose([Validators.required, PasswordValidator.validate(this.passwordValidatorConfig)])],
      'first_name': [first_name, [Validators.required, Validators.minLength(2)]],
      'last_name': [last_name, [Validators.required, Validators.minLength(2)]],
      'dayOfBirth': [dayOfBirth.toString(), [Validators.required]],
      'monthOfBirth': [monthOfBirth.toString(), [Validators.required]],
      'yearOfBirth': [yearOfBirth.toString(), [Validators.required]],
      'age': [age, [this.ageValidator.bind(this)]],
      'country': [country, [Validators.required]],
      'country_id': [country_id, [Validators.required]],
      'address': [address, [Validators.required]],
      'city': [city, [Validators.required]],
      'zip': [zip, [Validators.required]],
      'britishPostcode': [britishPostcode, []],
      'britishAddress': [britishAddress.toString(), []],
    });

    // ng-select build
    for (let i = 0; i < 30; i++) {
      this.optionsListDay.push({
        value: (i + 1).toString(),
        label: (i + 1).toString()
      });
    }

    this.monthNames.map((month, i) => {
      this.optionsListMonth.push({
        value: i.toString(),
        label: month
      });
    });

    for (let i = 1916; i < (new Date().getFullYear() - 18); i++) {
      this.optionsListYear.push({
        value: (i + 1).toString(),
        label: (i + 1).toString()
      });
    }

    this.selectedDay = dayOfBirth.toString();
    this.selectedMonth = monthOfBirth.toString();
    this.selectedYear = yearOfBirth.toString();
    this.selectedCountry = country.toString();
  }

  ageValidator(control: FormControl): {
    ageLimited?: boolean,
  } {
    const val = Number(control.value);
    if (val < this.limitedAge) {
      return {'ageLimited': true};
    }
    return null;
  }

  setDefaultCountry() {
    const countriesLength = this.countries.length;
    if (countriesLength <= 1) {
      if (countriesLength === 1) {
        this.setSelectedCountry(this.countries[0].name, this.countries[0].id);
        this.signupForm.controls['country'].disable();
      }
      return;
    }

    // If there is no value of country on session storage, get visitor country!
    if (!(('country_id' in this.sessionFormValues) && this.sessionFormValues['country_id'] !== '')) {
      this.store.select(fromRoot.getVisitorCountry)
        .takeUntil(this.ngUnsubscribe)
        .filter(vc => Object.keys(vc).length !== 0)
        .first()
        .subscribe(
          (vc: VisitorCountryInterface) => this.setSelectedCountry(vc.country.name, vc.country.id),
          error => this.setSelectedCountry('United Kingdom', 'GB')
        );
    }
  }

  setSelectedCountry(countryName, countryId) {
    this.signupForm.controls['country'].setValue(countryName);
    this.signupForm.controls['country_id'].setValue(countryId);
    this.selectedCountry = countryName;

    if (countryId === 'GB') {
      this.isUnitedKingdom = true;
      this.isShowPostcodeSearch = true;
      this.isShowFuulAddress = false;
    }
  }

  onSubmit() {
    this.onTrackSubmitClicked();
    const day = +this.signupForm.controls['dayOfBirth'].value;
    const month = +this.signupForm.controls['monthOfBirth'].value;
    const year = +this.signupForm.controls['yearOfBirth'].value;
    const dobUTC = this.formatDate(new Date(Date.UTC(year, month, day, 0, 0, 0)));

    const sentObj = {
      birth_date: dobUTC,
    };
    const obj = this.signupForm.value;
    delete obj['britishAddress'];
    delete obj['britishPostcode'];
    delete obj['yearOfBirth'];
    delete obj['monthOfBirth'];
    delete obj['dayOfBirth'];
    delete obj['age'];

    this.submitObj(Object.assign(obj, sentObj));
    if (this.device === 'mobile') {
      this.scrollService.scrollToErrorInForm(this.elementRef.nativeElement);
    }
  }

  submitObj(obj) {
    for (const cont in this.signupForm.controls) {
      if (this.signupForm.controls.hasOwnProperty(cont)) {
        this.signupForm.controls[cont].markAsTouched();
      }
    }
    if (this.signupForm.valid) {
      obj['marketing_email_allowed'] = !this.ac2.nativeElement.checked;
      this.authService.signup(obj).subscribe(
        user => this.signupSuccess(user),
        error => this.signupError(error)
      );
    } else {
      if (!this.listAddress && this.isShowPostcodeSearch) {
        const postcode = this.signupForm.controls['britishPostcode'].value;
        if (postcode !== '') {
          this.findAddress(this.signupForm.controls['britishPostcode'].value);
        } else {
          this.errorObj['britishPostcode'] = {message: this.brandTranslateService.getErrorMsg('not_valid_postcode')};
        }
      }
    }
  }

  formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }

  signupSuccess(user) {
    this.successSignin.emit();
    this.onTrackSuccessRegistration();
    this.clearForm();
    if (user.status_id === 'unverified') {
      this.checkIsAccountUnverified.emit();
    }
  }

  signupError(error) {
    if (error.error === 'Forbidden' && error.details.code === 'forbidden_country') {
      this.showNewComponent('register-forbidden-country');
    } else {
      this.errorObj = this.brandTranslateService.createErrorObj(error, 'email');
    }
    this.onTrackRegistrationSubmitButtonClicked('failure');
  }

  isErrorField(fieldName: string) {
    return fieldName in this.errorObj;
  }

  findAddress(postcode) {
    this.clearErrorMessages();
    this.authService.findAddressByPostcode(postcode).subscribe(
      addresses => this.saveAddress(addresses),
      error => this.onErrorSearchAddress(error)
    );
  }

  saveAddress(address) {
    this.listAddress = address;
    this.signupForm.controls['britishAddress'].setValue('0');
    this.signupForm.controls['address'].setValue(address[0].address);
    this.signupForm.controls['city'].setValue(address[0].city);
    this.signupForm.controls['zip'].setValue(this.signupForm.value.britishPostcode);
    this.onTrackFindAddressClicked('success');

    this.listAddress.map((adr, i) => {
      this.optionsListAddress.push({
        value: i.toString(),
        label: adr.address.toString()
      });
    });
  }

  onChangeAdress() {
    const selectedAddress = this.listAddress[this.signupForm.value.britishAddress];
    this.signupForm.controls['address'].setValue(selectedAddress.address);
    this.signupForm.controls['city'].setValue(selectedAddress.city);
    this.signupForm.controls['zip'].setValue(this.signupForm.value.britishPostcode);
  }

  onChangeFullAddress() {
    this.signupForm.controls['britishPostcode'].setValue(this.signupForm.value.postcode);
    this.listAddress = null;
  }

  onInputAddress() {
    const address = this.signupForm.controls['address'].value;
    if (address.length > this.limitAddressLength) {
      this.signupForm.controls['address'].setValue(address.substring(0, this.limitAddressLength));
    }
  }

  onErrorSearchAddress(error) {
    const message = this.brandTranslateService.getErrorMsg(error.message, 'britishPostcode');
    this.errorObj['britishPostcode'] = {message: message};
    this.listAddress = null;
    this.onTrackFindAddressClicked('failure');
  }

  showPassword(input) {
    input.type = input.type === 'text' ? 'password' : 'text';
  }

  showNewComponent(name: string) {
    this.showAnotherComponent.emit(name);
    this.clearForm();
  }

  clearForm() {
    this.clearErrorMessages();
  }

  clearErrorMessages() {
    this.errorObj = {};
  }

  onChange() {
    if (this.signupForm.value.country === '') {
      this.signupForm.controls['country_id'].setValue('');
    } else {
      for (const country of this.countries) {
        if (country.name === this.signupForm.value.country) {
          this.signupForm.controls['country_id'].setValue(country.id);
          break;
        }
      }
    }

    if (this.signupForm.value.country_id === 'GB') {
      this.isUnitedKingdom = true;
      this.isShowPostcodeSearch = true;
      this.isShowFuulAddress = false;
    } else {
      this.isUnitedKingdom = false;
      this.isShowPostcodeSearch = false;
      this.isShowFuulAddress = true;
    }
  }

  showFullAddressForUK() {
    this.isShowFuulAddress = true;
    this.isShowPostcodeSearch = false;
    this.analyticsDeprecatedService.trackEnterAddressManually();
  }

  showPostcodeSearch() {
    this.isShowFuulAddress = false;
    this.isShowPostcodeSearch = true;
  }

  onChangeBirthSelects() {
    const selectedDay = this.signupForm.value.dayOfBirth;
    const selectedMonth = this.signupForm.value.monthOfBirth;
    const selectedYear = this.signupForm.value.yearOfBirth;
    const countDaysInMonth = this.daysInMonth(selectedYear, selectedMonth);

    if (selectedDay > countDaysInMonth) {
      this.signupForm.controls['dayOfBirth'].setValue(countDaysInMonth);
    }
    this.daysCounter = new Array(countDaysInMonth);
    const age = this.getAge(new Date(selectedYear, +selectedMonth, selectedDay).getTime());
    this.signupForm.controls['age'].setValue(age);

    this.optionsListDay = [];
    for (let i = 0; i < countDaysInMonth; i++) {
      this.optionsListDay.push({
        value: (i + 1).toString(),
        label: (i + 1).toString()
      });
    }
  }

  getAge(dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  showFrontendError(field: string) {
    if (!this.errorForGA[field]) {
      this.errorForGA[field] = true;
    }
    return 'has-error';
  }

  hideFrontendError(field: string) {
    if (this.errorForGA[field]) {
      this.errorForGA[field] = false;
    }
    return '';
  }

  onChangeBritishPostcode() {
    this.listAddress = null;
    this.signupForm.controls['address'].setValue('');
    this.signupForm.controls['city'].setValue('');
    this.signupForm.controls['zip'].setValue('');

    const value = this.signupForm.controls['britishPostcode'].value;
    const text = value.replace(/[^a-zA-Z0-9 ]/g, '');
    this.signupForm.controls['britishPostcode'].setValue(text);
  }

  onKeyDownPostcode(event) {
    if (event.keyCode === 9 || event.keyCode === 13) {
      this.findAddress(this.signupForm.controls['britishPostcode'].value);
    }
  }

  onTrackFieldBlur(field: string) {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          if (this.errorForGA[field]) {
            this.onTrackFrontendError(field);
          } else {
            this.analyticsDeprecatedService.trackRegistrationFieldFilled(field);
          }
        });
      }, 200);
    });
  }

  onTrackSubmitClicked() {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          for (const error in this.errorForGA) {
            if (this.errorForGA[error]) {
              this.onTrackFrontendError(error);
            }
          }
        });
      }, 200);
    });
  }

  onTrackRegistrationSubmitButtonClicked(status) {
    this.analyticsDeprecatedService.trackRegistrationSubmitButtonClicked(this.label, status);
  }

  onTrackSuccessRegistration() {
    this.analyticsDeprecatedService.trackRegistrationSuccess(this.label);
    this.onTrackRegistrationSubmitButtonClicked('success');
  }

  onTrackFrontendError(field: string) {
    this.analyticsDeprecatedService.trackRegistrationFieldError(field);
  }

  onTrackAlreadyMemberClicked() {
    this.analyticsDeprecatedService.trackAlreadyMemberClicked();
  }

  onTrackFindAddressClicked(status: string) {
    this.analyticsDeprecatedService.trackFindAddressClicked(status);
  }

  ngOnDestroy() {
    this.setFormValuesIntoSessionStorage();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setFormValuesIntoSessionStorage() {
    const formValues = this.signupForm.value;
    delete formValues['password'];
    this.webStorageService.setItem('signup-form', formValues, 'sessionStorage');
  }

  toggleTermsAndConditions(ev) {
    // console.log(this.ac1.nativeElement.checked);
    this.isTermsAccepted = !this.isTermsAccepted;
  }

  toggleAcceptOffers(ev) {
    // console.log(ev);
  }
}
