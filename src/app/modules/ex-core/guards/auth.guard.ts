import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router,
  RouterStateSnapshot
} from '@angular/router';
import { Store } from '@ngrx/store';

import { AuthService } from '../../../services/auth/auth.service';

import * as fromRoot from '../../../store/reducers/index';
import * as authActions from '../../../store/actions/auth.actions';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthGuard implements CanLoad, CanActivate, CanActivateChild {
  redirectUrl: string;

  constructor(private store: Store<fromRoot.State>,
              private router: Router,
              private authService: AuthService,
              @Inject(PLATFORM_ID) private platformId: Object) {  }

  canLoad(route: Route): boolean {
    return this.checkLogin('/' + route.path);
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean {
    return this.checkLogin(state.url);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkLogin(state.url);
  }

  checkLogin(url: string): boolean {
    if (this.authService.checkLogin()) {
      return true;
    } else {
      this.storeUrl(url);
      if (url === '/cashier') {
        this.router.navigate(['/signup'], {replaceUrl: true});
      } else {
        this.router.navigate(['/login']);
      }
      return false;
    }
  }

  storeUrl(url: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(new authActions.SetRedirectUrl(url));
    }
  }
}
