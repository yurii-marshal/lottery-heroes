import { Component, EventEmitter, Output, ChangeDetectionStrategy, Input } from '@angular/core';
import { AnalyticsDeprecatedService } from '../../../analytics-deprecated/services/analytics-deprecated.service';
import { LineInterface } from '../../../api/entities/outgoing/common/line.interface';

@Component({
  selector: 'app-confirmation-remove-line-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-confirmation-remove-line
      (closeRemoveLineConfirmation)="hideConfirmation()"
      (approveRemove)="approveRemove()"
    ></app-confirmation-remove-line>`
})
export class ConfirmationRemoveLineContainerComponent {
  @Input() line: LineInterface;

  @Output() closeRemoveLineConfirmation = new EventEmitter<string>();
  @Output() removeApproved = new EventEmitter<LineInterface>();

  constructor(public analyticsDeprecatedService: AnalyticsDeprecatedService) {
  }

  hideConfirmation() {
    this.closeRemoveLineConfirmation.emit();
    this.analyticsDeprecatedService.trackCartInteractionClick('lucky line');
  }

  approveRemove() {
    this.hideConfirmation();
    this.removeApproved.emit(this.line);
  }
}
