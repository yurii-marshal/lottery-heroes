import { MetadataArray } from '@angular/compiler-cli';

export class ArraysUtil {
  /**
   * Check is value in array.
   * @param arr
   * @param item
   * @returns {boolean}
   */
  static inArray(arr, item): boolean {
    return arr.indexOf(item) !== -1;
  }

  /**
   * Remove value from array.
   * @param item
   * @param arr
   * @returns {boolean}
   */
  static removeValue(item, arr): boolean {
    const index = arr.indexOf(item);
    if (index !== -1) {
      return arr.splice(index, 1).length > 0;
    }
    return false;
  }

  /**
   * Find object in list of objects where object has key equal value and optionally replace it
   * @param arr
   * @param key
   * @param value
   * @param replaceBy
   * @returns {any}
   */
  static findObjByKeyValue<T>(arr: Array<T>, key: string, value: any, replaceBy?: T): T | null {
    if (!arr) {
      return null;
    }

    const length = arr.length;
    for (let i = 0; i < length; i++) {
      const obj = arr[i];
      if (obj[key] === value) {
        if (replaceBy) {
          arr[i] = replaceBy;
        }
        return obj;
      }
    }
    return null;
  }

  /**
   * Convert an array-like object to a real array.
   * @param thing
   * @returns {any}
   */
  static toArray(thing: any): Array<any> {
    return Array.prototype.slice.call(thing);
  }

  /**
   * Shuffle an array elements.
   * @param array
   * @returns array
   */
  static shuffle(array: Array<any>): Array<any> {
    let currentIndex: number = array.length,
      temporaryValue: number,
      randomIndex: number;

    while (0 !== currentIndex) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  /**
   * returns an array of unique elements (primitive types only!)
   * @param {any[]} arrayFirst
   * @param {any[]} arraySecond
   * @returns {any[]}
   */
  static difference(arrayFirst: any[], arraySecond: any[]): any[] {
    return arrayFirst
      .filter(x => arraySecond.indexOf(x) === -1);
  }

  /**
   * returns an array with elements that appear in both arrays ([1,2,3], [2,3,'string']) => [2,3]
   * @param {any[]} arrayFirst
   * @param {any[]} arraySecond
   * @returns {any[]}
   */
  static intersection(arrayFirst: any[], arraySecond: any[]): any[] {
    return arrayFirst
      .filter(item => arraySecond.indexOf(item) !== -1)
      .filter((item, index, self) => {
        return self.indexOf(item) === index;
      });
  }

  /**
   * returns an array with unique elements ([1,'string',1,'string'] => [1,'string'])
   * @param {any[]} array
   * @returns {any[]}
   */
  static unique(array: any[]): any[] {
    return array.filter((item, index, self) => {
      return self.indexOf(item) === index;
    });
  }

  /**
   * returns an array with unique elements that contains two arrays ([1,2,3], [2,3,'string']) => [1,2,3,'string']
   * @param {any[]} arrayFirst
   * @param {any[]} arraySecond
   * @returns {any[]}
   */
  static union(arrayFirst: any[], arraySecond: any[]): any[] {
    return this.unique(arrayFirst.concat(arraySecond));
  }
}

