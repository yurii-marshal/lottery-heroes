import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-lottery-widgets-stories-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-lottery-widgets-stories></app-lottery-widgets-stories>
  `,
})
export class LotteryWidgetsStoriesContainerComponent  {}
