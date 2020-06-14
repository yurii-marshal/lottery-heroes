import { Pipe, PipeTransform } from '@angular/core';

/**
 * Add commas to thousands
 * Example: 1000000 to 1,000,000
 */
@Pipe({name: 'numberFormat'})
export class NumberFormatPipe implements PipeTransform {
  static addCommas(value: number): string {
    if (value === null || typeof value === 'undefined') {
      return '';
    }

    const parts = value.toString().split('.');
    let part1 = parts[0];
    const part2 = parts.length > 1 ? '.' + parts[1] : '';
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(part1)) {
      part1 = part1.replace(rgx, '$1' + ',' + '$2');
    }
    return part1 + part2;
  }

  transform(value: number): string {
    return NumberFormatPipe.addCommas(value);
  }
}
