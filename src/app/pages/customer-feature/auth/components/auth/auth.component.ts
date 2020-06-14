import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../../../../store/reducers/index';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  authRedirectUrl: string;
  storeGetRedirectUrl: Subscription;
  aliveSubscriptions = true;

  constructor(private store: Store<fromRoot.State>) {
    this.storeGetRedirectUrl = this.store.select(fromRoot.getAuthRedirectUrl)
      .takeWhile(() => this.aliveSubscriptions)
      .subscribe(
      (url: string) => this.authRedirectUrl = url
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.storeGetRedirectUrl.unsubscribe();
    this.aliveSubscriptions = false;
  }

}
