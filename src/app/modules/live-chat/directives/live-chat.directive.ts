import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';
import { BrandParamsService } from '../../brand/services/brand-params.service';

@Directive({
  selector: '[appLiveChat]'
})
export class LiveChatDirective implements AfterViewInit, OnDestroy {
  listenClickFunc: Function;

  constructor(private element: ElementRef,
              private renderer: Renderer2,
              private brandParamsService: BrandParamsService) { }

  ngAfterViewInit() {
    this.brandParamsService.getConfig('windowLiveChatId').subscribe(configValue => {
      this.listenClickFunc = this.renderer.listen(this.element.nativeElement, 'click', (event) => {
        event.preventDefault();
        console.log('open chat here');
        // SnapEngage.startLink();
      });
    });
  }

  ngOnDestroy() {
    if (this.listenClickFunc) {
      this.listenClickFunc();
    }
  }

}
