import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { StaticPageCmsInterface } from '../../entities/static-page-cms.interface';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-static-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './static-page.component.html',
  styleUrls: ['./static-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StaticPageComponent implements OnChanges {
  @Input()
  cms: StaticPageCmsInterface;

  body: SafeHtml;

  constructor(private domSanitizer: DomSanitizer) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cms'] && changes['cms'].currentValue !== null && changes['cms'].currentValue.body) {
      this.body = this.domSanitizer.bypassSecurityTrustHtml(changes['cms'].currentValue.body);
    }
  }
}
