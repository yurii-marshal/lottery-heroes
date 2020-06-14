import { Component, ElementRef, EventEmitter, Inject, Input, OnChanges, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { ComboItemModel } from '../../../../../../models/combo.model';
import { DeviceType } from '../../../../../../services/device/entities/types/device.type';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-top-combos-item',
  templateUrl: './top-combos-item.component.html',
  styleUrls: ['./top-combos-item.component.scss']
})
export class TopCombosItemComponent implements OnChanges {
  @Input() combo: ComboItemModel;
  @Input() device: DeviceType;

  @Output() addToCart = new EventEmitter();

  @ViewChild('tooltip') tooltip: ElementRef;

  showLotteriesList = false;

  constructor(@Inject(DOCUMENT) private document,
              protected renderer: Renderer2) {}

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
