import {
  Component, ChangeDetectionStrategy, Input, Output, EventEmitter, AfterViewInit, Renderer2, ElementRef,
  Inject, PLATFORM_ID
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { isPlatformBrowser } from '@angular/common';

import { of } from 'rxjs/observable/of';
import { LineInterface } from '../../../../../../modules/api/entities/outgoing/common/line.interface';

@Component({
  selector: 'app-filled-ticket-mobile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filled-ticket-mobile.component.html',
  styleUrls: ['./filled-ticket-mobile.component.scss']
})
export class FilledTicketMobileComponent implements AfterViewInit {
  @Input() lineIndex: number;
  @Input() line: LineInterface;
  @Input() isLastLine: boolean;

  @Output() editFilledLineEvent = new EventEmitter<{lineIndex: number; line: LineInterface}>();
  @Output() deleteFilledLineEvent = new EventEmitter<LineInterface>();

  constructor(private renderer: Renderer2,
              private el: ElementRef,
              @Inject(PLATFORM_ID) private platformId: Object) {
  }

  ngAfterViewInit(): void {
    this.animateLastLine();
  }

  animateLastLine(): void {
    if (isPlatformBrowser(this.platformId)) {
      const elements = this.el.nativeElement.querySelectorAll('.number');
      if (this.isLastLine) {
        for (let i = 0; i < elements.length; i++) {
          of(elements[i]).delay(i * 100).subscribe(() => {
            this.renderer.addClass(elements[i], 'visible');
          });
        }
      } else {
        for (let i = 0; i < elements.length; i++) {
          of(elements[i]).subscribe(() => {
            this.renderer.addClass(elements[i], 'existed');
          });
        }
      }
    }
  }
}
