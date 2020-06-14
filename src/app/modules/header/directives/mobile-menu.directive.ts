import { Directive, HostListener } from '@angular/core';
import { GlobalService } from '../../../services/global.service';

@Directive({
  selector: '[appCloseMobileMenu]'
})
export class CloseMobileMenuDirective {

  constructor(private globalService: GlobalService) {
  }

  @HostListener('click')
  closeMobileMenu() {
    this.globalService.showMobileMenuBehaviorSubject$.next(false);
  }
}
