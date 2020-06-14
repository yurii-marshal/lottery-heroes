import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
  PLATFORM_ID,
  Renderer2
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { of } from 'rxjs/observable/of';
import { LineInterface } from '../../../../../../modules/api/entities/outgoing/common/line.interface';

@Component({
  selector: 'app-free-filled-ticket-mobile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './free-filled-ticket-mobile.component.html',
  styleUrls: ['./free-filled-ticket-mobile.component.scss']
})
export class FreeFilledTicketMobileComponent implements AfterViewInit {
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
