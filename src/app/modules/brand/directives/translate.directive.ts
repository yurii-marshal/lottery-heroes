import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  PLATFORM_ID,
  Renderer2
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {LightboxesService} from '../../lightboxes/services/lightboxes.service';
import {BrandParamsService} from '../services/brand-params.service';
import {isPlatformBrowser} from '@angular/common';
import {GlobalService} from '../../../services/global.service';
import {EscapeSanitizePipe} from '../../shared/pipes/escape-sanitize.pipe';
import {WindowService} from '../../../services/device/window.service';

@Directive({
  selector: '[appTranslate]'
})
export class TranslateDirective implements AfterViewInit, OnDestroy {
  @Input() appTranslate: string;
  @Input() param: string;
  listenClickFunc: Function;

  constructor(private element: ElementRef,
              private translate: TranslateService,
              private router: Router,
              private renderer: Renderer2,
              private windowService: WindowService,
              @Inject(PLATFORM_ID) private platformId: Object,
              private lightboxesService: LightboxesService,
              private cdRef: ChangeDetectorRef,
              private globalService: GlobalService,
              private safeHTMLPipe: EscapeSanitizePipe,
              private brandParamsService: BrandParamsService) {
  }

  ngAfterViewInit() {
    this.appTranslate = this.appTranslate ? this.appTranslate : ' ';
    this.parseTranslateText();
    this.translate.onLangChange.subscribe(() => {
      this.parseTranslateText();
    });
  }

  parseTranslateText() {
    this.translate.get(this.appTranslate).subscribe((translateText: string) => {
      // console.log(this.safeHTMLPipe.transform(translateText, 'html'));
      this.element.nativeElement.innerHTML = translateText;
      if (isPlatformBrowser(this.platformId)) {
        const navigationElements = Array.prototype.slice.call(this.element.nativeElement.querySelectorAll('a[routerLink]'));

        let queryObj;
        navigationElements.forEach((elem) => {
          elem.setAttribute('href', elem.getAttribute('routerLink'));
          this.listenClickFunc = this.renderer.listen(elem, 'click', (event) => {
            event.preventDefault();
            this.closeAllLightboxes();
            queryObj = elem.getAttribute('queryParams') ? JSON.parse(elem.getAttribute('queryParams')) : {};
            this.router.navigate([elem.getAttribute('routerLink')], {queryParams: queryObj});
          });
        });

        const navigationLiveChatElements = Array.prototype.slice.call(this.element.nativeElement.querySelectorAll('a[appLiveChat]'));
        navigationLiveChatElements.forEach(elem => {
          this.renderer.listen(elem, 'click', (event) => {
            event.preventDefault();
            this.closeAllLightboxes();
            this.windowService.nativeWindow['fcWidget'].open();
            // SnapEngage.startLink();
          });
        });

        const navigationSupportEmailElements = Array.prototype.slice.call(this.element.nativeElement.querySelectorAll('[supportEmail]'));
        if (navigationSupportEmailElements.length > 0) {
          this.brandParamsService.getConfig('supportEmail').subscribe((email: string) => {
            navigationSupportEmailElements.forEach(elem => {
              const mailto = 'mailto:' + email;
              elem.innerHTML = `<a href="${mailto}">${email}</a>`;
            });
          });
        }
      }
    });
  }

  closeAllLightboxes() {
    this.lightboxesService.getCloseAllEventEmitter().emit();
    // this.globalService.showLightbox$.emit({name: 'auth', value: false});
  }

  ngOnDestroy() {
    if (this.listenClickFunc) {
      this.listenClickFunc();
    }
  }

}
