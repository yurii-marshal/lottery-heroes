import { AbstractControl } from '@angular/forms';
import * as revealCard from 'credit-card-reveal';

export class CreditCardValidator {

  public static cardTypeCheck(c: AbstractControl) {
    const cardNumber = c.value.replace(/\s/g, '');
    return (revealCard(cardNumber) !== 'Unknown') ? null : {
      validateCreditCard: {
        valid: false
      }
    };
  }

  // Taken from https://gist.github.com/ShirtlessKirk/2134376 and
  // slightly changed (replaced bitwise operation, changed variable names)
  // due to linting restriction rule according to WTFPL License.
  public static luhnCheck(c: AbstractControl) {
    const cardNumber: string = c.value.replace(/\s/g, '');
    const luhnArr: Array<number> = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];
    let luhnVal: number;
    let luhnSum = 0;
    let cardNumberLength: number = cardNumber.length;
    let isEven = false;

    while (cardNumberLength) {
      luhnVal = parseInt(cardNumber.charAt(--cardNumberLength), 10);
      luhnSum += isEven ? luhnArr[luhnVal] : luhnVal;
      isEven = !isEven;
    }

    if (luhnSum && luhnSum % 10 === 0) {
      return null;
    } else {
      return {
        validateCreditCard: {
          valid: false
        }
      };
    }
  }
}
