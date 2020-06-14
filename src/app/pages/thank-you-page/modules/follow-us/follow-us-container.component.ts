import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-follow-us-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-follow-us></app-follow-us>`
})

export class FollowUsContainerComponent {
  constructor() {
  }
}
