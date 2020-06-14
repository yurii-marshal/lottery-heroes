import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';
import * as realTimeNotificationsActions from './actions/real-time-notifications.actions';
import * as fromRoot from '../../../../store/reducers/index';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as personalResultsActions from '../../../../store/actions/personal-results.actions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-real-time-notifications-container',
  template: `
    <app-real-time-notifications
      (oSubmitEvent)="onSubmit($event)"
    ></app-real-time-notifications>
  `
})
export class RealTimeNotificationsContainerComponent implements AfterViewInit {
  @Input() boxName: string;
  @Input() boxNumber: number;

  constructor(private authService: AuthService,
              private store: Store<fromRoot.State>,
              private router: Router) {
  }

  onSubmit(mobile: string) {
    this.authService.updatedUser({mobile: mobile}).subscribe(() => {
        this.store.dispatch(new realTimeNotificationsActions.ClickKeepMeUpdated({ url: this.router.url }));
      });

    this.store.dispatch(new personalResultsActions.BoxClicked({
      boxName: this.boxName, boxNumber: this.boxNumber, pageUrl: this.router.url
    }));
  }

  ngAfterViewInit(): void {
    this.store.dispatch(new personalResultsActions.BoxPresented({
      boxName: this.boxName, boxNumber: this.boxNumber, pageUrl: this.router.url
    }));
  }
}
