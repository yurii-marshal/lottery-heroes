import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComboItemModel } from '../../../models/combo.model';

@Component({
  selector: 'app-combos-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './combos-page.component.html',
  styleUrls: ['./combos-page.component.scss']
})
export class CombosPageComponent {
  @Input() mainCombo: ComboItemModel;
  @Input() topCombos: Array<ComboItemModel>;
  @Input() otherCombos: Array<ComboItemModel>;
}
