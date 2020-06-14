import { Component, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-confirmation-remove-line',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirmation-remove-line.component.html',
  styleUrls: ['./confirmation-remove-line.component.scss']
})
export class ConfirmationRemoveLineComponent {
  @Output() closeRemoveLineConfirmation = new EventEmitter<string>();
  @Output() approveRemove = new EventEmitter<string>();
}
