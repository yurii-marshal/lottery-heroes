import { Component, Inject } from '@angular/core';
import { GeneralComponent } from '../general/general.component';
import { LightboxesService } from '../../services/lightboxes.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-delete-cart-item-lightbox',
  templateUrl: './delete-cart-item-lightbox.html',
  styleUrls: ['./delete-cart-item-lightbox.scss']
})
export class DeleteCartItemLightboxComponent extends GeneralComponent {
  lightboxName = 'delete-cart-item-lightbox';

  constructor(lightboxesService: LightboxesService,
              @Inject(DOCUMENT) document) {
    super(lightboxesService, document);
  }
}
