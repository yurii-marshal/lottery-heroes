import {Component, OnInit, Input, OnDestroy, ElementRef} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../../../../services/auth/auth.service';
import {LuvService} from '../../../../../services/luv.service';
import {Observable} from 'rxjs/Observable';
import {CustomerInterface} from '../../../../../services/auth/entities/interfaces/customer.interface';
import {GlobalService} from '../../../../../services/global.service';
import {CustomerService} from '../../../../../services/auth/customer.service';
import {ScrollService} from '../../../../../services/device/scroll.service';
import {DeviceService} from '../../../../../services/device/device.service';
import {IOption} from 'ng-select';
import {LightboxesService} from '../../../../../modules/lightboxes/services/lightboxes.service';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../../../store/reducers/index';
import {Subject} from 'rxjs/Subject';
import {combineLatest} from 'rxjs/observable/combineLatest';


@Component({
  selector: 'app-customer-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  daysCounter = new Array(31);
  yearsCounter = new Array(new Date().getFullYear() - 1917 - 15);
  personalDetailsForm: FormGroup;
  @Input() customer;
  countries;
  customerObj: CustomerInterface;
  customerCountry;
  year = 11;
  month = 9;
  day = 1991;
  isEditDetails = false;
  customerStatusId: string;
  device: string;
  sessionStatus: string;

  // ng-select
  optionsListDay: Array<IOption> = [];
  optionsListMonth: Array<IOption> = [];
  optionsListYear: Array<IOption> = [];
  optionsListCountries: Array<IOption> = [];
  selectedDay: string;
  selectedMonth: string;
  selectedYear: string;
  selectedCountry: string;

  constructor(private store: Store<fromRoot.State>,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private luvService: LuvService,
              private globalService: GlobalService,
              private customerService: CustomerService,
              private deviceService: DeviceService,
              private scrollService: ScrollService,
              private elementRef: ElementRef,
              private lightboxesService: LightboxesService) {
    this.store.select(fromRoot.getSessionStatus)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((status: string) => this.sessionStatus = status);
  }

  ngOnInit() {
    combineLatest(
      this.customer,
      this.luvService.getCountriesBrand()
    ).subscribe(
      data => {
        this.customerObj = data[0] ? data[0] : {};
        this.countries = data[1];
        this.setCustomerCountry();
        this.createCountriesSelect();
      },
      err => console.error(err)
    );

    this.customerService.getCustomerStatusId()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(statusId => this.customerStatusId = statusId);
    this.deviceService.getDevice()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((device) => this.device = device);
  }

  setCustomerCountry() {
    for (const country of this.countries) {
      if (country.id === this.customerObj.country_id) {
        this.customerCountry = country.name;
      }
    }
    this.buildForm(this.customerObj);
  }

  private buildForm({
                      first_name = '',
                      last_name = '',
                      birth_date = '',
                      city = '',
                      zip = '',
                      address = '',
                      countryCode = '',
                      mobile = '',
                      country_id = '',
                    }) {
    if (birth_date !== '') {
      const date = new Date(birth_date);
      this.year = date.getFullYear();
      this.month = date.getMonth() + 1;
      this.day = date.getDate();
    }
    this.personalDetailsForm = this.formBuilder.group({
      'first_name': [first_name, [Validators.required, Validators.minLength(3)]],
      'last_name': [last_name, [Validators.required, Validators.minLength(3)]],
      'dayOfBirth': [this.day.toString()],
      'monthOfBirth': [this.month.toString()],
      'yearOfBirth': [this.year.toString()],
      'country': [this.customerCountry],
      'city': [city, Validators.required],
      'zip': [zip, Validators.required],
      'address': [address, Validators.required],
      'countryCode': [{value: countryCode, disabled: true}],
      'mobile': [mobile],
      'country_id': [country_id]
    });

    // ng-select build
    for (let i = 0; i < 31; i++) {
      this.optionsListDay.push({
        value: (i + 1).toString(),
        label: (i + 1).toString()
      });
    }

    this.monthNames.map((month, i) => {
      this.optionsListMonth.push({
        value: (i + 1).toString(),
        label: month
      });
    });

    for (let i = 1916; i < (new Date().getFullYear() - 18); i++) {
      this.optionsListYear.push({
        value: (i + 1).toString(),
        label: (i + 1).toString()
      });
    }

    this.selectedDay = this.day.toString();
    this.selectedMonth = this.month.toString();
    this.selectedYear = this.year.toString();
    this.selectedCountry = this.customerCountry;
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

  onChangeSelects() {
    const selectedDay = this.personalDetailsForm.value.dayOfBirth;
    const selectedMonth = this.personalDetailsForm.value.monthOfBirth;
    const selectedYear = this.personalDetailsForm.value.yearOfBirth;
    const countDaysInMonth = this.daysInMonth(selectedYear, selectedMonth);
    if (selectedDay > countDaysInMonth) {
      this.personalDetailsForm.controls['dayOfBirth'].setValue(countDaysInMonth);
    }
    this.daysCounter = new Array(countDaysInMonth);

    this.optionsListDay = [];
    for (let i = 0; i < countDaysInMonth; i++) {
      this.optionsListDay.push({
        value: (i + 1).toString(),
        label: (i + 1).toString()
      });
    }
  }

  onChange(selectCountry) {
    if (selectCountry === '') {
      this.personalDetailsForm.controls['country_id'].setValue('');
      this.personalDetailsForm.controls['countryCode'].setValue('');
      return;
    }

    for (const country of this.countries) {
      if (country.name === selectCountry) {
        this.personalDetailsForm.controls['country_id'].setValue(country.id);
        this.personalDetailsForm.controls['countryCode'].setValue(country.dial_code);
        return;
      }
    }
  }

  daysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  onSaveForm() {
    if (this.personalDetailsForm.valid) {
      const day = this.personalDetailsForm.value.dayOfBirth;
      const month = this.personalDetailsForm.value.monthOfBirth;
      const year = this.personalDetailsForm.value.yearOfBirth;
      const dobUTC = this.formatDate(new Date(Date.UTC(year, month - 1, day, 0, 0, 0)));

      const obj: any = Object.assign(this.personalDetailsForm.value, {birth_date: dobUTC});
      delete obj.dayOfBirth;
      delete obj.monthOfBirth;
      delete obj.yearOfBirth;
      delete obj.country;

      this.authService.updatedUser(obj).subscribe(
        user => this.onSuccesUpdate(user),
        error => this.onErrorUpdate(error)
      );
    }

    if (this.device === 'mobile') {
      this.scrollService.scrollToErrorInForm(this.elementRef.nativeElement);
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

  onSuccesUpdate(user) {
    this.onTriggerEditDetails();
  }

  onErrorUpdate(error) {
  }

  onCancelForm() {
    this.buildForm(this.customerObj);
    this.onTriggerEditDetails();
  }

  onTriggerEditDetails() {
    if (this.isLimitedActivity() || this.isAccountUnverified()) {
      return;
    }
    this.isEditDetails = !this.isEditDetails;
  }

  isLimitedActivity(): boolean {
    if (this.sessionStatus === 'limited') {
      this.lightboxesService.show({
        type: 'general',
        title: 'Lightboxes.sessionStatusTittle',
        message: 'Lightboxes.sessionStatusMessage',
      });
      return true;
    }

    if (this.customerStatusId === 'limited') {
      this.globalService.showLightbox$.emit({name: 'limited-status', value: ''});
      return true;
    }
    return false;
  }

  isAccountUnverified(): boolean {
    if (this.customerStatusId === 'unverified') {
      this.globalService.showLightbox$.emit({name: 'account-unverified', value: 'not verified'});
      return true;
    }
    return false;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
