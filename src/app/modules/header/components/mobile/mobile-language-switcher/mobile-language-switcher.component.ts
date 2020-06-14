import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID,
  OnInit,
  Input,
  Output,
  EventEmitter, HostListener
} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {LotteryInterface} from '../../../../api/entities/incoming/lotteries/lotteries.interface';
import {TranslateService} from '@ngx-translate/core';
import {GlobalService} from '../../../../../services/global.service';

@Component({
  selector: 'app-mobile-language-switcher',
  templateUrl: './mobile-language-switcher.component.html',
  styleUrls: ['./mobile-language-switcher.component.scss']
})
export class MobileLanguageSwitcherComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input() superJackpotLottery$: Observable<LotteryInterface>;

  // BrandParams
  showSupportPhone: boolean;
  toggler = true;
  showMenuItem: { [key: string]: boolean };
  showBetVsPlay: boolean;
  isShowChat: boolean;

  // TranslateParams
  @Input() brandId: string;
  @Input() translateLangItems: string;
  @Input() translateLang;
  @Output() languageItemClicked = new EventEmitter<string>();

  @ViewChild('mobileLangSwitcher') mobileLangSwitcher: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              public translateService: TranslateService,
              private elementRef: ElementRef,
              private globalService: GlobalService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // if (isPlatformBrowser(this.platformId) && Hammer) {
    //   this.mc = new Hammer(this.mobileLangSwitcher.nativeElement);
    //   this.mc.on('swipeleft', () => this.close());
    // }
  }

  ngOnDestroy(): void {
    // if (isPlatformBrowser(this.platformId) && Hammer && this.mc) {
    //   this.mc.off('swipeleft');
    // }
  }

  onLanguageItemClicked(langItem?: string): void {
    this.globalService.showMobileMenuBehaviorSubject$.next(false);
    this.languageItemClicked.emit(langItem);
  }

  toggleDropDown(event, link: HTMLElement, dropDown: HTMLElement): void {
    // if (event.target.classList.contains('active')) {
    //     Velocity(dropDown, 'slideDown', {display: 'flex', duration: 200});
    //     Velocity(link, {rotateZ: '180deg'}, {duration: 200});
    //
    //     event.target.classList.remove('active');
    // } else {
    //     Velocity(dropDown, 'slideUp', {duration: 200});
    //     Velocity(link, {rotateZ: '0deg'}, {duration: 200});
    //
    //     event.target.classList.add('active');
    // }
  }
}
