import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ComboItemModel } from '../../../../models/combo.model';

@Component({
  selector: 'app-main-combo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main-combo.component.html',
  styleUrls: ['./main-combo.component.scss']
})
export class MainComboComponent {
  @Input() combo: ComboItemModel;

  @Output() addToCart = new EventEmitter();

  showLotteriesList = false;
  private toggler = true;

  @ViewChild('lotteriesList') lotteriesList: ElementRef;

  toggleList() {
    this.showLotteriesList = !this.showLotteriesList;
    if (this.toggler) {
      Velocity(this.lotteriesList.nativeElement, 'slideDown', {display: 'block', duration: 200});
      this.toggler = false;
    } else {
      Velocity(this.lotteriesList.nativeElement, 'slideUp', {duration: 200});
      this.toggler = true;
    }
  }
}
