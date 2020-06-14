import { Component, Inject, NgZone } from '@angular/core';
import { timer } from 'rxjs/observable/timer';

import { ArraysUtil } from '../../../shared/utils/arrays.util';
import { NumbersUtil } from '../../../shared/utils/numbers.util';
import { ObjectsUtil } from '../../../shared/utils/objects.util';
import { isFilledLine } from '../../../shared/utils/lines/is-filled-line';
import { isCleanLine } from '../../../shared/utils/lines/is-clean-line';
import { CartItemModel } from '../../../../models/cart/cart-item.model';
import { GeneralComponent } from '../general/general.component';
import { LightboxesService } from '../../services/lightboxes.service';
import { LightboxDataInterface } from '../../interfaces/lightbox-data.interface';
import { LotteryRulesInterface } from '../../../api/entities/incoming/lotteries/lotteries.interface';
import { LineInterface, SelectionTypeIdType } from '../../../api/entities/outgoing/common/line.interface';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-edit-line-lightbox',
  templateUrl: './edit-line-lightbox.component.html',
  styleUrls: ['./edit-line-lightbox.component.scss'],
})
export class EditLineLightboxComponent extends GeneralComponent {
  item: CartItemModel;
  editedLine: LineInterface;
  lineIndex: number;
  rules: LotteryRulesInterface;

  private isAnimationRun = false;

  lightboxName = 'edit-line-lightbox';

  constructor(lightboxesService: LightboxesService,
              @Inject(DOCUMENT) document,
              private zone: NgZone) {
    super(lightboxesService, document);

    lightboxesService.getShowEventEmitter()
      .filter((data: LightboxDataInterface) => data.type === this.lightboxName)
      .subscribe((data: LightboxDataInterface) => {
        this.item = this.data.payload.item;
        this.editedLine = ObjectsUtil.deepClone(this.data.payload.editedLine);
        this.lineIndex = this.data.payload.lineIndex;
        this.rules = this.data.payload.rules;
      });
  }

  clickBtnSave(payload: {item: CartItemModel, editedLine: LineInterface}) {
    this.isShowlightbox = false;
    this.getBtnByType('save').handler(payload);
  }

  onAutoselectClickEvent(): void {
    const serializedLine = JSON.stringify(this.editedLine);

    this.zone.runOutsideAngular(() => {
      timer(0, 100).take(6)
        .subscribe(() => {
          this.zone.run(() => {
            this.editedLine = this.autoselect(JSON.parse(serializedLine), this.rules);
          });
        });
    });
  }

  onClearClickEvent(): void {
    this.editedLine = this.clear(this.editedLine);
  }

  isPickedMain(value: number): boolean {
    return this.isAnimationRun === false && ArraysUtil.inArray(this.editedLine.main_numbers, value);
  }

  isPickedExtra(value: number): boolean {
    return this.isAnimationRun === false && ArraysUtil.inArray(this.editedLine.extra_numbers, value);
  }

  toggleMain(value: number): void {
    if (this.isPickedMain(value)) {
      this.removeMain(value);
    } else {
      this.pickMain(value);
    }
  }

  toggleExtra(value: number): void {
    if (this.isPickedExtra(value)) {
      this.removeExtra(value);
    } else {
      if (this.rules.extra_numbers.picks === 1) {
        this.editedLine.extra_numbers = [];
      }
      this.pickExtra(value);
    }
  }

  private removeMain(value: number): void {
    ArraysUtil.removeValue(value, this.editedLine.main_numbers);
  }

  private removeExtra(value: number): void {
    ArraysUtil.removeValue(value, this.editedLine.extra_numbers);
  }

  private pickMain(num: number): void {
    if (this.editedLine.main_numbers.length < this.rules.main_numbers.picks) {
      this.editedLine.selection_type_id = this.getSelectionTypeIdOnManual(this.editedLine);
      this.editedLine.main_numbers.push(num);
    }
  }

  private pickExtra(num: number): void {
    if (this.editedLine.extra_numbers.length < this.rules.extra_numbers.picks) {
      this.editedLine.selection_type_id = this.getSelectionTypeIdOnManual(this.editedLine);
      this.editedLine.extra_numbers.push(num);
    }
  }

  private clear(line: LineInterface): LineInterface {
    line.main_numbers = [];
    line.extra_numbers = [];
    return line;
  }

  private autoselect(line: LineInterface, rules: LotteryRulesInterface): LineInterface {
    let clearBeforePick = false;

    if (isFilledLine(line, rules)) {
      line.main_numbers = [];
      line.extra_numbers = [];
      clearBeforePick = true;
    }

    line.selection_type_id = this.getSelectionTypeIdOnAuto(line, clearBeforePick);

    line.main_numbers = NumbersUtil.getRandomUniqueNumbersArray(
      line.main_numbers,
      rules.main_numbers.picks,
      rules.main_numbers.lowest,
      rules.main_numbers.highest
    );

    if (rules.extra_numbers && !rules.extra_numbers.in_results_only) {
      line.extra_numbers = NumbersUtil.getRandomUniqueNumbersArray(
        line.extra_numbers,
        rules.extra_numbers.picks,
        rules.extra_numbers.lowest,
        rules.extra_numbers.highest
      );
    }

    return line;
  }

  private getSelectionTypeIdOnManual(line: LineInterface): SelectionTypeIdType {
    if (isCleanLine(line)) {
      return 'manual';
    } else {
      switch (line.selection_type_id) {
        case 'automatic':
          return 'mixed';
        case 'mixed':
          return 'mixed';
        default:
          return 'manual';
      }
    }
  }

  private getSelectionTypeIdOnAuto(line: LineInterface, clearBeforePick: boolean): SelectionTypeIdType {
    if (clearBeforePick) {
      return 'automatic';
    } else {
      switch (line.selection_type_id) {
        case 'manual':
          if (isCleanLine(line)) {
            return 'automatic';
          } else {
            return 'mixed';
          }
        case 'mixed':
          return 'mixed';
        default:
          return 'automatic';
      }
    }
  }
}
