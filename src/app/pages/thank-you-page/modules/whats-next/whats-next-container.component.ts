import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-whats-next-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-whats-next></app-whats-next>`
})

export class WhatsNextContainerComponent {
  constructor() {
  }
}
