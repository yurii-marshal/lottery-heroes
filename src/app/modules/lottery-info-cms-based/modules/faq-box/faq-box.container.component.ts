import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-faq-box-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-faq-box
      [cms]="cms"
    ></app-faq-box>
  `
})
export class FaqBoxContainerComponent {
  @Input() cms: any;
}
