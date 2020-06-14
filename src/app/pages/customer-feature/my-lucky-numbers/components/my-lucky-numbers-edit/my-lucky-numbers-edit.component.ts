import { Component, Input } from '@angular/core';
import { LuckyNumbersItemInterface } from '../../../../../services/api/entities/incoming/lotteries/lucky-numbers.interface';
import { MyLuckyNumbersSandbox } from '../../my-lucky-numbers.sandbox';

@Component({
  selector: 'app-my-lucky-numbers-edit',
  templateUrl: './my-lucky-numbers-edit.component.html',
  styleUrls: ['./my-lucky-numbers-edit.component.scss']
})
export class MyLuckyNumbersEditComponent {
  @Input() editLuckyNumbers: Array<LuckyNumbersItemInterface>;
  @Input() editNewLuckyNumbers: Array<LuckyNumbersItemInterface>;

  constructor(private myLuckyNumbersSandbox: MyLuckyNumbersSandbox) {
  }

  addNewEmptyGroup() {
    this.myLuckyNumbersSandbox.addNewEmptyGroup();
  }

}
