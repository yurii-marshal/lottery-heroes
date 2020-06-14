import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { BrandParamsService } from '../../../../../../modules/brand/services/brand-params.service';
import * as fromRoot from '../../../../../../store/reducers/index';
import { Store } from '@ngrx/store';
import * as followUsActions from '../../actions/follow-us.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-follow-us',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './follow-us.component.html',
  styleUrls: ['./follow-us.component.scss'],
})
export class FollowUsComponent implements OnInit {

  facebookUrl: string;

  constructor(private brandParamsService: BrandParamsService,
              private store: Store<fromRoot.State>,
              private router: Router) {
  }

  ngOnInit(): void {
    this.brandParamsService.getConfig('followUsModule', 'facebookUrl')
      .subscribe(configValue => this.facebookUrl = configValue);
  }

  onTrackSocialIconClicked() {
    this.store.dispatch(new followUsActions.ClickFollowUs({ url: this.router.url }));
  }
}
