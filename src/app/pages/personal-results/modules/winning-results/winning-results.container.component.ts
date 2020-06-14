import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Renderer2 } from '@angular/core';

import { CustomerInterface } from '../../../../services/auth/entities/interfaces/customer.interface';
import { LotteryInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { TicketsService } from '../../../../services/tickets.service';
import { LineInterface } from '../../../../modules/api/entities/outgoing/common/line.interface';

@Component({
  selector: 'app-winning-results-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-winning-results
      *ngIf="customerLines.length"
      [customer]="customer"
      [lottery]="lottery"
      [draw]="draw"
      [customerLines]="customerLines"
      [customerWinningStatus]="customerWinningStatus"
      [customerAmountWon]="customerAmountWon"

      (toggleCustomerLines)="onToggleCustomerLines($event)"
    ></app-winning-results>
  `,
})
export class WinningResultsContainerComponent implements OnInit {
  @Input() customer: CustomerInterface;
  @Input() lottery: LotteryInterface;
  @Input() draw: DrawInterface;

  customerLines: Array<LineInterface> = [];
  customerAmountWon = 0;
  customerWinningStatus = false;

  constructor(protected changeDetectorRef: ChangeDetectorRef,
              private ticketsService: TicketsService,
              private renderer: Renderer2) {
  }

  ngOnInit() {
    this.getCustomerLines(this.draw.id);
  }

  getCustomerLines(drawId) {
    this.ticketsService.getSettledLinesByDraw(drawId).subscribe(lines => {
      lines.lines
        .filter(line => line.line_status_id === 'won' || line.line_status_id === 'lost' || line.line_status_id === 'pending')
        .forEach(line => {
          this.customerLines.push(JSON.parse(line.numbers));
          this.customerAmountWon += line.lottery_amount_won;
          if (this.customerAmountWon !== 0) {
            this.customerWinningStatus = true;
          }
        });

      this.changeDetectorRef.markForCheck();
    });
  }

  setCustomerLinesView(customerLines, drawNumbers, container) {
    container.innerHTML = '';
    customerLines.forEach(line => {
      const lineContainer = this.renderer.createElement('div');
      lineContainer.classList.add('display-flex', 'flex-items-xs-center', 'flex-items-xs-middle', 'line');

      this.setNumbers(line.main, drawNumbers.main, 'main', lineContainer);
      if (line.extra) {
        this.setNumbers(line.extra, drawNumbers.extra, 'extra', lineContainer);
      }
      if (line.perticket) {
        this.setNumbers(line.perticket, drawNumbers.perticket, 'extra', lineContainer);
      }

      this.renderer.appendChild(container, lineContainer);
    });
  }

  setNumbers(lineNumbersMap, drawNumbersMap, numClass, line) {
    lineNumbersMap.forEach(number => {
      const span = this.renderer.createElement('span');
      span.classList.add('display-flex', 'flex-items-xs-center', 'flex-items-xs-middle', 'number', numClass);
      span.innerHTML = number;

      drawNumbersMap.forEach(drawNum => {if (number === drawNum) { this.renderer.addClass(span, 'matched'); }});
      this.renderer.appendChild(line, span);
    });
  }

  onToggleCustomerLines(elems) {
    elems.container.classList.toggle('open');
    const drawNumbers = {
      main: this.draw.winning_main_numbers,
      extra: this.draw.winning_extra_numbers,
      perticket: this.draw.winning_perticket_numbers
    };
    this.setCustomerLinesView(this.customerLines, drawNumbers, elems.list);
  }

}
