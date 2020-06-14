import { Component, OnDestroy, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { LightboxesService } from '../../services/lightboxes.service';
import { LightboxDataInterface } from '../../interfaces/lightbox-data.interface';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../store/reducers';
import * as lightboxesActions from '../../actions/lightboxes.actions';

@Component({
  selector: 'app-redirection-limit-lightbox',
  templateUrl: './redirection-limit-lightbox.html',
  styleUrls: ['./redirection-limit-lightbox.scss']
})
export class RedirectionLimitLightboxComponent implements OnDestroy {
  @ViewChild('redirectionLinkContainer') set content(element: ElementRef) {
    if (element !== undefined) {
      const redirectionLinkEl = element.nativeElement.querySelector('.redirection-link');
      this.addTrackListenerToRedirectionLink(redirectionLinkEl);
    }
  }

  lightboxName = 'redirection';
  isShowlightbox = false;
  data: LightboxDataInterface;
  closeSubscription: Subscription;

  constructor(private lightboxesService: LightboxesService,
              private store: Store<fromRoot.State>,
              private renderer: Renderer2) {
    lightboxesService.getShowEventEmitter()
      .filter((data: LightboxDataInterface) => data.type === this.lightboxName)
      .subscribe((data: LightboxDataInterface) => this.showLightbox(data));
    this.closeSubscription = lightboxesService.getCloseAllEventEmitter().subscribe(() => this.closeLightbox());
  }

  showLightbox(data: LightboxDataInterface) {
    this.data = data;
    this.isShowlightbox = true;
    this.store.dispatch(new lightboxesActions.LightboxPopup({ lightboxName: this.lightboxName }));
  }

  closeLightbox() {
    this.isShowlightbox = false;
    if (this.data && ('closeHandler' in this.data)) {
      this.data.closeHandler();
    }
    this.store.dispatch(new lightboxesActions.RedirectionLightboxClickStay());
  }

  onTrackRedirected(): void {
    this.store.dispatch(new lightboxesActions.RedirectionLightboxRedirected());
  }

  ngOnDestroy() {
    this.closeSubscription.unsubscribe();
  }

  private addTrackListenerToRedirectionLink(redirectionLinkEl: ElementRef | null) {
    if (redirectionLinkEl !== null) {
      this.renderer.listen(redirectionLinkEl, 'click', () => {
        this.onTrackRedirected();
      });
    }
  }

}
