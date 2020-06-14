import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-how-to-play-box-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-how-to-play-box
      [cms]="cms"
    ></app-how-to-play-box>
  `
})
export class HowToPlayBoxContainerComponent {
  @Input() cms: any;
}
