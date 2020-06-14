import {Injectable, EventEmitter} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ArraysUtil} from '../modules/shared/utils/arrays.util';
import {Observable} from 'rxjs/Observable';
import {LocationStrategy} from '@angular/common';

@Injectable()
export class GlobalService {
  showLightbox$ = new EventEmitter();
  showMobileMenuBehaviorSubject$ = new BehaviorSubject<boolean>(false);
  showMobileLanguageSwitcherBehaviorSubject$ = new BehaviorSubject<boolean>(false);
  cashier = false;
  isShowFooter = true;
  footerClassList = [];

  boSessionHeader$ = new BehaviorSubject<string | undefined>(undefined);

  constructor(private location: LocationStrategy) {
  }

  addFooterClass(className): void {
    this.footerClassList.push(className);
  }

  removeFooterClass(className): void {
    ArraysUtil.removeValue(className, this.footerClassList);
  }

  // toggle mobile menu
  toggleMenu(): void {
    const isShownMobileMenu = this.showMobileMenuBehaviorSubject$.getValue();
    this.showMobileMenuBehaviorSubject$.next(!isShownMobileMenu);
  }

  // toggle mobile language switcher
  toggleLanguageSwitcher(): void {
    const isShownMobileLanguageSwitcher = this.showMobileLanguageSwitcherBehaviorSubject$.getValue();
    this.showMobileLanguageSwitcherBehaviorSubject$.next(!isShownMobileLanguageSwitcher);
  }

  removeLangSuffix() {
    let path = this.location['_platformLocation'].pathname;
    ['en', 'de', 'fr', 'fi', 'no', 'sv', 'da', 'pl'].forEach((item) => {
      path = path.replace(new RegExp(`/${item}/`, 'g'), '');
    });
    this.location.replaceState('', '', path, '');
  }
}
