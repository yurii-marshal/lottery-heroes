import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ticket-edit-mobile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ticket-edit-mobile.component.html',
  styleUrls: ['./ticket-edit-mobile.component.scss']
})
export class TicketEditMobileComponent {
  @Input() lineIndex: number;
  @Input() editedLineDelayed: boolean;

  @Output() closeEditEvent = new EventEmitter();
}
