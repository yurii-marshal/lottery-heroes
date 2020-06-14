import {
  Component, ChangeDetectionStrategy, Input, Output, EventEmitter, Renderer2, Inject, PLATFORM_ID, AfterViewInit, ViewChild, ElementRef
} from '@angular/core';

import { ScrollService } from '../../../../../../services/device/scroll.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-new-ticket-mobile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './new-ticket-mobile.component.html',
  styleUrls: ['./new-ticket-mobile.component.scss'],
})
export class NewTicketMobileComponent implements AfterViewInit {
  @Input() lineIndex: number;

  @Output() newLineAutoselectEvent = new EventEmitter<void>();
  @Output() newLineEditEvent = new EventEmitter<void>();

  @ViewChild('newLine') newLine: ElementRef;
  @ViewChild('newLineContainer') newLineContainer: ElementRef;

  constructor(private renderer: Renderer2,
              @Inject(PLATFORM_ID) private platformId: Object,
              private scrollService: ScrollService) {
  }

  ngAfterViewInit(): void {
    this.scrollToComponent();
  }

  onNewLineAutoselectEvent(): void {
    this.newLineAutoselectEvent.emit();
    this.scrollToComponent();
  }

  private scrollToComponent(): void {
    if (isPlatformBrowser(this.platformId)) {
      const element = this.newLineContainer.nativeElement;
      this.renderer.addClass(element, 'visible');
      this.scrollService.scrollTo(this.newLine.nativeElement);
    }
  }
}
