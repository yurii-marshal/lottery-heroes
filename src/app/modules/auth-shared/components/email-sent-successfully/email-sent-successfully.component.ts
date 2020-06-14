import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-email-sent-successfully',
  templateUrl: './email-sent-successfully.component.html',
  styleUrls: ['./email-sent-successfully.component.scss']
})
export class EmailSentSuccessfullyComponent {
  @Input() emailForReset;
}
