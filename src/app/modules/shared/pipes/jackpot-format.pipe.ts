import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

/**
 * @whatItDoes Formats a jackpot number as currency plus string using rules.
 * Example: X > 99,999,999 ->	XXX Million (253 Million, 888 Million)
 *          999,999 < X < 100,000,000 -> X Million / X.X Million / XX Million / XX.X Million (1 Million, 12.1 Million)
 *          X < 1,000,000 -> XXK / XXXK (37K, 500K)
 * @howToUse `number_expression | jackpotFormat[:currencyCode[:millText[:html]]]`
 */
@Pipe({name: 'jackpotFormat'})
export class JackpotFormatPipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) {}

  transform(value: number, currencyCode: string, millText = 'Million', thousandText = 'K', html = true, asterix = false): string {
    let formatedValue = '';
    let val = '';

    if (!html) {
      millText = millText.length > 1 ? ' ' + millText : millText;
      thousandText = thousandText.length > 1 ? ' ' + thousandText : thousandText;
    }

    if (value >= 99999999) {
      val = this.currencyPipe.transform(value / 1000000, currencyCode, 'symbol', '1.0-0');
      formatedValue = html ? ('<span class="jackpot-val">' + val + '</span>' + (asterix ? '<span class="asterix">*</span>' : '') +
        '<span class="str-mil">' + millText + '</span>') :
        (val + (asterix ? '*' : '') + millText);
    } else if (value > 999999 && value < 100000000) {
      val = this.currencyPipe.transform(value / 1000000, currencyCode, 'symbol', '1.0-1');
      formatedValue = html ? ('<span class="jackpot-val">' + val + '</span>' + (asterix ? '<span class="asterix">*</span>' : '') +
        '<span class="str-mil">' + millText + '</span>') :
        (val + (asterix ? '*' : '') + millText);
    } else if (value <= 1000000) {
      val = this.currencyPipe.transform(value / 1000, currencyCode, 'symbol', '1.0-0');
      formatedValue = html ? ('<span class="jackpot-val">' + val + '</span>' + '<span class="str-k">' + thousandText +  '</span>' +
        (asterix ? '<span class="asterix">*</span>' : '')) :
        (val + (asterix ? '*' : '') + thousandText);
    }

    return formatedValue;
  }
}
