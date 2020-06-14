import { Pipe, PipeTransform } from '@angular/core';

/**
 * @whatItDoes Formats a jackpot number as currency plus string using rules.
 * Example: X > 99,999,999 ->	XXX Million (253 Million, 888 Million)
 *          999,999 < X < 100,000,000 -> X Million / X.X Million / XX Million / XX.X Million (1 Million, 12.1 Million)
 *          X < 1,000,000 -> XXK / XXXK (37K, 500K)
 * @howToUse `number_expression | jackpotFormat[:currencyCode[:millText[:html]]]`
 */
@Pipe({name: 'jackpotRound'})
export class JackpotRoundPipe implements PipeTransform {

  transform(value: number): number {
    let roundedValue;

    if (value <= 999999) {
      roundedValue =  Math.round(value / 1000) * 1000;
    } else if (value > 999999 && value < 100000000) {
      roundedValue = Math.round(value / 100000) * 100000;
    } else {
      roundedValue = Math.round(value / 1000000) * 1000000;
    }

    return roundedValue;
  }
}
