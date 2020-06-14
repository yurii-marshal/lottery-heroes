import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-tranding-now',
  templateUrl: './tranding-now.component.html',
  styleUrls: ['./tranding-now.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TrandingNowComponent {

  @Input() trandingNow: {
    slug: string;
    title: string;
    date: Date;
    image: string;
    shortContent: string;
  }[];
  @Input() host: string;
}
