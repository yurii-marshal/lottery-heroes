export class NumbersUtil {
  /**
   * Add leading zeroes to number.
   * @param num Number to edit.
   * @param size Amount of symbols in result string.
   * @returns {string}
   */
  static pad(num: number, size = 2): string {
    let str = num.toString();
    while (str.length < size) {
      str = '0' + str;
    }
    return str;
  }

  /**
   * Generate random integer number between min and max, inclusive.
   * @param min
   * @param max
   * @returns {number}
   */
  static randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Get array and fills it with 'picks' random unique numbers from 'lowest' to 'highest'
   * @param arr
   * @param picks
   * @param lowest
   * @param highest
   * @returns {Array<number>}
   */
  static getRandomUniqueNumbersArray(arr: Array<number>, picks: number, lowest: number, highest: number): Array<number> {
    while (arr.length < picks) {
      const randomNum = NumbersUtil.randomIntFromInterval(lowest, highest);
      if (arr.indexOf(randomNum) === -1) {
        arr.push(randomNum);
      }
    }
    return arr;
  }

  /**
   * Round price to avoid bugs like 2.8*6=16.799999999999997
   * @param price
   * @returns {number}
   */
  static roundPrice(price: number): number {
    return Math.round(price * 100) / 100;
  }

  /**
   * Use in in sort function arrOfNum.sort(NumbersUtil.sortNumbersAscFunction)
   * @param a
   * @param b
   * @returns {number}
   */
  static sortNumbersAscFunction(a: number, b: number) {
    return a - b;
  }

  /**
   * Use in in sort function arrOfNum.sort(NumbersUtil.sortNumbersAscFunction)
   * @param a
   * @param b
   * @returns {number}
   */
  static sortNumbersDescFunction(a: number, b: number) {
    return b - a;
  }
}
