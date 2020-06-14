import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { WordpressService } from '../../../../../../services/wordpress/wordpress.service';

@Component({
  selector: 'app-tranding-now-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-tranding-now
      *ngIf="vertical === false"
      [host]="host"
      [trandingNow]="trandingNow$ | async"
    ></app-tranding-now>
    <app-tranding-now-vertical
      *ngIf="vertical === true"
      [host]="host"
      [trandingNow]="trandingNow$ | async"
    ></app-tranding-now-vertical>
  `,
})
export class TrandingNowContainerComponent implements OnInit {

  @Input() vertical = false;

  trandingNow$: Observable<{
    slug: string;
    title: string;
    date: Date;
    image: string;
    shortContent: string;
  }[]>;

  host: string;

  constructor(private wordpressService: WordpressService) {
  }

  ngOnInit() {
    this.trandingNow$ = this.wordpressService.getTrendingNow();
    this.host = this.wordpressService.getHost();
  }
}
