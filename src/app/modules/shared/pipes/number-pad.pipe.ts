import { Pipe, PipeTransform } from '@angular/core';
import { NumbersUtil } from '../utils/numbers.util';

/**
 * Add leading zeroes to number.
 * Example 1: "2|numberPad:6" "000002"
 * Example 2: "2|numberPad" "02"
 */
@Pipe({name: 'numberPad'})
export class NumberPadPipe implements PipeTransform {
  transform(value: number, size = 2): string {
    return NumbersUtil.pad(value, size);
  }
}
