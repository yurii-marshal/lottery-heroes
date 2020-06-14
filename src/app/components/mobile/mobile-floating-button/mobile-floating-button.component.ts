import { Component, OnInit } from '@angular/core';
import { ScrollService } from '../../../services/device/scroll.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../store/reducers';
import * as headerActions from '../../../modules/header/actions/header.actions';

@Component({
  selector: 'app-mobile-floating-button',
  templateUrl: './mobile-floating-button.component.html',
  styleUrls: ['./mobile-floating-button.component.scss']
})
export class MobileFloatingButtonComponent implements OnInit {
  isAddClass$: Observable<boolean>;
  readonly pixelsFromTop = 100;

  constructor(private scrollService: ScrollService,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.isAddClass$ = this.scrollService.getYOffset().map(e => e > this.pixelsFromTop);
  }

  toTop() {
    this.scrollService.toTop();
    this.store.dispatch(new headerActions.ClickMobileScroll);
  }

}
