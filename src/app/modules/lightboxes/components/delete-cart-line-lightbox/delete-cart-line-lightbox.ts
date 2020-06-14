import { Component, Inject } from '@angular/core';
import { GeneralComponent } from '../general/general.component';
import { LightboxesService } from '../../services/lightboxes.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-delete-cart-line-lightbox',
  templateUrl: './delete-cart-line-lightbox.html',
  styleUrls: ['./delete-cart-line-lightbox.scss']
})
export class DeleteCartLineLightboxComponent extends GeneralComponent {
  lightboxName = 'delete-cart-line-lightbox';

  constructor(lightboxesService: LightboxesService,
              @Inject(DOCUMENT) document) {
    super(lightboxesService, document);
  }
}
