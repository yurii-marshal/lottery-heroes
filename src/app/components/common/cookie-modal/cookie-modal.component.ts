import { Component, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cookie-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cookie-modal.component.html',
  styleUrls: ['./cookie-modal.component.scss']
})
export class CookieModalComponent {
  @Output() hideCookieModalEvent: EventEmitter<string> = new EventEmitter<string>();
}
