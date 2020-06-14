import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LuckyNumbersItemInterface } from '../../../../../services/api/entities/incoming/lotteries/lucky-numbers.interface';
import { MyLuckyNumbersSandbox } from '../../my-lucky-numbers.sandbox';
import { Subscription } from 'rxjs/Subscription';
import { AnalyticsDeprecatedService } from '../../../../../modules/analytics-deprecated/services/analytics-deprecated.service';

@Component({
  selector: 'app-my-lucky-numbers-line',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './my-lucky-numbers-line.component.html',
  styleUrls: ['./my-lucky-numbers-line.component.scss']
})
export class MyLuckyNumbersLineComponent implements OnInit, OnDestroy {
  @Input() group: LuckyNumbersItemInterface;
  @Input() index: number;
  lineCounter = new Array(8);
  luckyNumbersLineForm: FormGroup;
  storeOldGroupsSubscription: Subscription;
  storedNum: number | string;
  formValuesArray: number[] = [];
  isGroupEmpty = false;

  constructor(private formBuilder: FormBuilder,
              private changeDetectorRef: ChangeDetectorRef,
              private myLuckyNumbersSandbox: MyLuckyNumbersSandbox) {
    this.storeOldGroupsSubscription = myLuckyNumbersSandbox.getStoreGroupsEvent().subscribe(() => this.storeOldGroup());
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    const numbers = this.group.numbers;
    this.luckyNumbersLineForm = this.formBuilder.group({
      'num_1': numbers[0] ? numbers[0] : '',
      'num_2': numbers[1] ? numbers[1] : '',
      'num_3': numbers[2] ? numbers[2] : '',
      'num_4': numbers[3] ? numbers[3] : '',
      'num_5': numbers[4] ? numbers[4] : '',
      'num_6': numbers[5] ? numbers[5] : '',
      'num_7': numbers[6] ? numbers[6] : '',
      'num_8': numbers[7] ? numbers[7] : ''
    });
  }

  storeOldGroup() {
    const groupForSave: LuckyNumbersItemInterface = {numbers: []};
    const numbers: number[] = [];
    const formVal = this.luckyNumbersLineForm.value;
    for (const key in formVal) {
      if (formVal.hasOwnProperty(key) && formVal[key] !== '') {
        numbers.push(Number(formVal[key]));
      }
    }

    this.isGroupEmpty = numbers.length > 0 ? false : true;
    this.changeDetectorRef.markForCheck();
    groupForSave.numbers = numbers;
    groupForSave.name = this.group.name;
    groupForSave.id = this.group.id;
    this.myLuckyNumbersSandbox.storeOldGroup({group: groupForSave, index: this.index});
  }

  onTrashIconClicked() {
    this.myLuckyNumbersSandbox.showRemoveLightbox({type: 'old', index: this.index});
  }

  onFocus(control) {
    const formValues = this.luckyNumbersLineForm.value;
    this.formValuesArray = [];
    this.storedNum = formValues[control];

    for (const key in formValues) {
      if (formValues.hasOwnProperty(key) && formValues[key] !== '') {
        this.formValuesArray.push(Number(formValues[key]));
      }
    }
  }

  onBlur(control) {
    const value = Number(this.luckyNumbersLineForm.controls[control].value);

    if (this.isGroupEmpty === true) {
      this.checkIsGroupEmpty();
    }

    if (this.formValuesArray.includes(value)) {
      if (this.storedNum !== '') {
        this.luckyNumbersLineForm.controls[control].setValue(this.storedNum);
      } else {
        this.luckyNumbersLineForm.controls[control].setValue('');
      }
    } else {
      this.onTrackNewLuckyNumber(this.luckyNumbersLineForm.controls[control].value);
    }
    this.storedNum = '';
  }

  checkIsGroupEmpty() {
    const formValues = this.luckyNumbersLineForm.value;
    for (const key in formValues) {
      if (formValues.hasOwnProperty(key) && formValues[key] !== '') {
        this.isGroupEmpty = false;
        this.changeDetectorRef.markForCheck();
        break;
      }
    }
  }

  onInputMaxCheck(inputName) {
    const value = this.luckyNumbersLineForm.value[inputName];
    if (!(/^([1-9]|[1-9][0-9])$/.test(value))) {
      this.luckyNumbersLineForm.controls[inputName].setValue(value.slice(0, -1));
    }
  }

  onTrackNewLuckyNumber(value: string) {
    if (value !== '') {
      this.myLuckyNumbersSandbox.onTrackNewLuckyNumber(value);
    }
  }

  ngOnDestroy() {
    this.storeOldGroupsSubscription.unsubscribe();
  }

}
