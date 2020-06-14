import { Component, Input } from '@angular/core';
import { LuckyNumbersItemInterface } from '../../../../../services/api/entities/incoming/lotteries/lucky-numbers.interface';

@Component({
  selector: 'app-my-lucky-numbers-saved',
  templateUrl: './my-lucky-numbers-saved.component.html',
  styleUrls: ['./my-lucky-numbers-saved.component.scss']
})
export class MyLuckyNumbersSavedComponent {
  @Input() editLuckyNumbers: Array<LuckyNumbersItemInterface>;
}
