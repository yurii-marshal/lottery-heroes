import { Component, Inject, OnDestroy } from '@angular/core';
import { GeneralComponent } from '../general/general.component';
import { LightboxesService } from '../../services/lightboxes.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-syndicate-lightbox',
  templateUrl: './syndicate-lightbox.component.html',
  styleUrls: ['./syndicate-lightbox.component.scss']
})
export class SyndicateLightboxComponent extends GeneralComponent implements OnDestroy {
  lightboxName = 'syndicate';

  constructor(lightboxesService: LightboxesService,
              @Inject(DOCUMENT) document) {
    super(lightboxesService, document);
  }
}
