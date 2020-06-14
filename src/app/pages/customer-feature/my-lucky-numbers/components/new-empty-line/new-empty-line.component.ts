import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LuckyNumbersItemInterface } from '../../../../../services/api/entities/incoming/lotteries/lucky-numbers.interface';
import { MyLuckyNumbersSandbox } from '../../my-lucky-numbers.sandbox';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-new-empty-line',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './new-empty-line.component.html',
  styleUrls: ['./new-empty-line.component.scss']
})
export class NewEmptyLineComponent implements OnInit, OnDestroy {
  @Input() group;
  @Input() index: number;
  lineCounter = new Array(8);
  formValuesArray: number[] = [];
  storedNum: number | string;
  luckyNumbersLineForm: FormGroup;
  storeNewGroupsSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private myLuckyNumbersSandbox: MyLuckyNumbersSandbox) {
    this.storeNewGroupsSubscription = myLuckyNumbersSandbox.getStoreGroupsEvent().subscribe(() => this.storeNewGroup());
  }

  ngOnInit() {
    this.buildForm();
  }

  storeNewGroup() {
    const groupForSave: LuckyNumbersItemInterface = {numbers: []};
    const numbers: number[] = [];
    const formVal = this.luckyNumbersLineForm.value;
    for (const key in formVal) {
      if (formVal.hasOwnProperty(key) && formVal[key] !== '') {
        numbers.push(Number(formVal[key]));
      }
    }
    if (numbers.length !== 0) {
      groupForSave.numbers = numbers;
      this.myLuckyNumbersSandbox.storeNewGroup({group: groupForSave, index: this.index});
    }
  }

  private buildForm() {
    this.luckyNumbersLineForm = this.formBuilder.group({
      'num_1': '',
      'num_2': '',
      'num_3': '',
      'num_4': '',
      'num_5': '',
      'num_6': '',
      'num_7': '',
      'num_8': ''
    });
  }

  onRemoveNewGroup() {
    this.myLuckyNumbersSandbox.showRemoveLightbox({type: 'new', index: this.index});
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
    this.storeNewGroupsSubscription.unsubscribe();
  }

}
