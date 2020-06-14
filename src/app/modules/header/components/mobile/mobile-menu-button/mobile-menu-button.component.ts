import { Component, ElementRef, OnInit, OnDestroy, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';

import { GlobalService } from '../../../../../services/global.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-mobile-menu-button',
  templateUrl: './mobile-menu-button.component.html',
  styleUrls: ['./mobile-menu-button.component.scss']
})
export class MobileMenuButtonComponent implements OnInit, OnDestroy {
  private buttonEl: HTMLElement;
  private aliveSubscriptions = true;

  constructor(private globalService: GlobalService,
              private renderer: Renderer2,
              private el: ElementRef,
              @Inject(DOCUMENT) private document,
              @Inject(PLATFORM_ID) private platformId: Object) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.buttonEl = this.el.nativeElement.querySelector('.hamburger');

      this.globalService.showMobileMenuBehaviorSubject$
        .takeWhile(() => this.aliveSubscriptions)
        .subscribe(() => this.toggleButton());
    }
  }

  toggleMenu(): void {
    this.globalService.toggleMenu();
  }

  toggleButton(): void {
    const isShownMobileMenu = this.globalService.showMobileMenuBehaviorSubject$.getValue();

    if (isShownMobileMenu) {
      this.renderer.addClass(this.buttonEl, 'is-active');
      this.document.body.classList.add('fixedBody');
    } else {
      this.renderer.removeClass(this.buttonEl, 'is-active');
      this.document.body.classList.remove('fixedBody');
    }
  }

  ngOnDestroy(): void {
    this.aliveSubscriptions = false;
  }
}
