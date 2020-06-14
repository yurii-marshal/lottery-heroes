import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-response-deposit',
  templateUrl: './response-deposit.component.html',
  styleUrls: ['./response-deposit.component.scss']
})
export class ResponseDepositComponent implements OnInit {
  @Input() responseComponent;
  constructor() { }

  ngOnInit() {
  }

}
