import {Component, ElementRef, EventEmitter, Inject, Input, OnChanges, Output, Renderer2, SimpleChanges, ViewChild} from '@angular/core';
import {DeviceType} from '../../../../../../services/device/entities/types/device.type';
import {DOCUMENT} from '@angular/common';
import {BundleItemModel} from '../../../../../../models/bundle.model';

@Component({
  selector: 'app-list-bundles-item',
  templateUrl: './list-bundles-item.component.html',
  styleUrls: ['./list-bundles-item.component.scss']
})
export class ListBundlesItemComponent implements OnChanges {
  @Input() bundle: BundleItemModel;
  @Input() device: DeviceType;

  @Output() addToCart = new EventEmitter();

  @ViewChild('tooltip') tooltip: ElementRef;

  showLotteriesList = false;

  constructor(@Inject(DOCUMENT) private document,
              protected renderer: Renderer2) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['device'] && this.tooltip) {
      this.closeLotteriesList();
    }
  }

  openLotteriesList() {
    if (this.device === 'mobile') {
      this.showLotteriesList = true;
      this.tooltip.nativeElement.classList.toggle('open');
      this.renderer.addClass(this.document.body, 'fixed');
    }
  }

  closeLotteriesList() {
    this.showLotteriesList = false;
    this.tooltip.nativeElement.classList.remove('open');
    this.renderer.removeClass(this.document.body, 'fixed');
  }
}
