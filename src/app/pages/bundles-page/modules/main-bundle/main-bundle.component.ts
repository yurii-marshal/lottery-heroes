import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {BundleItemModel} from '../../../../models/bundle.model';

@Component({
  selector: 'app-main-bundle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main-bundle.component.html',
  styleUrls: ['./main-bundle.component.scss']
})
export class MainBundleComponent {
  @Input() bundle: BundleItemModel;

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
