import { Component, Input, OnInit } from '@angular/core';
import { LotteryInterface } from '../../../../../api/entities/incoming/lotteries/lotteries.interface';

@Component({
  selector: 'app-why-box',
  templateUrl: './why-box.component.html',
  styleUrls: ['./why-box.component.scss']
})
export class WhyBoxComponent implements OnInit {

  @Input() lottery: LotteryInterface;
  @Input() cms: any;

  constructor() { }

  ngOnInit() {
  }

}
