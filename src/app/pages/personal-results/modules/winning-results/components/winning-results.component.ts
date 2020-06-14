import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CustomerInterface } from '../../../../../services/auth/entities/interfaces/customer.interface';
import { LotteryInterface } from '../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { DrawInterface } from '../../../../../modules/api/entities/incoming/lotteries/draws.interface';
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';
import { LineInterface } from '../../../../../modules/api/entities/outgoing/common/line.interface';

@Component({
  selector: 'app-winning-results',
  templateUrl: './winning-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./winning-results.component.scss'],
  animations: [
    trigger('ball-animation', [
      transition('* => *', [
        query('.number.main', style({ transform: 'translateX(750px) rotate(320deg)' }), { optional: true }),
        query('.number.extra', style({ opacity: 0 }), { optional: true }),
        query('.number.main', stagger(200, [
          animate('1.1s linear', style({
            transform: 'translateX(0) rotate(0deg)',
          }))
        ]), { optional: true }),
        query('.number.extra', stagger(210, [
          animate('0.2s ease', style({
            transform: 'scale(1.2)',
            opacity: 0.7
          })),
          animate('0.2s ease-in', style({
            transform: 'scale(0.8)',
            opacity: 1
          })),
          animate('0.2s ease', style({
            transform: 'scale(1)',
          }))
        ]), { optional: true }),
      ]),
    ])
  ]
})
export class WinningResultsComponent {
  @Input() customer: CustomerInterface;
  @Input() lottery: LotteryInterface;
  @Input() draw: DrawInterface;
  @Input() customerLines: Array<LineInterface>;
  @Input() customerWinningStatus: boolean;
  @Input() customerAmountWon: number;

  @Output() toggleCustomerLines = new EventEmitter() ;

  @ViewChild('customerLinesContainer') customerLinesContainer: ElementRef;
  @ViewChild('customerLinesList') customerLinesList: ElementRef;
}
