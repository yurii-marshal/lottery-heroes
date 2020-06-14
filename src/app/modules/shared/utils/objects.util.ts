import { IdUtil } from './id.util';
import { LineInterface } from '../../api/entities/outgoing/common/line.interface';

export class ObjectsUtil {
  /**
   * @param obj
   * @returns {boolean}
   */
  static isEmptyObject(obj: Object): boolean {
    return Object.getOwnPropertyNames(obj).length === 0;
  }

  /**
   * Compare 2 objects by values.
   * Works when you have simple JSON-style objects without methods and DOM nodes inside.
   * @param first
   * @param second
   * @returns {boolean}
   */
  static isEqualByValues(first: Object, second: Object): boolean {
    return JSON.stringify(first) === JSON.stringify(second);
  }

  /**
   * Creates clone of the object, don't use it for functions
   * @param objectToClone
   * @returns {any}
   */
  static deepClone<T>(objectToClone: T): T {
    // Handle the 3 simple types, and null or undefined
    if (objectToClone === null || typeof objectToClone !== 'object') {
      return objectToClone;
    }

    // Handle Date
    if (objectToClone instanceof Date) {
      const copy = new Date();
      copy.setTime(objectToClone.getTime());

      return <T><any>copy;
    }

    // Handle Array
    if (objectToClone instanceof Array) {
      const copy = new Array();
      for (let i = 0, len = objectToClone.length; i < len; i++) {
        copy[i] = this.deepClone(objectToClone[i]);
      }

      return <T><any>copy;
    }

    // Handle Object
    if (objectToClone instanceof Object) {
      const copy: T = <T>{};
      for (const attr in objectToClone) {
        if (attr in objectToClone) {
          copy[attr] = this.deepClone(objectToClone[attr]);
        }
      }

      return <T>copy;
    }
  }

  /**
   * Fetch values from object
   * @param obj
   * @returns {any[]}
   */
  static getValues(obj: Object): Array<any> {
    return Object.keys(obj).map(key => obj[key]);
  }

  static parseLine(rawLine: any): LineInterface {
    if (typeof rawLine === 'undefined' || rawLine === null) {
      return;
    }
    const lineNumbers = JSON.parse(rawLine.numbers);
    return <LineInterface>{
      id: IdUtil.generateUniqueId(),
      lottery_id: rawLine.lottery_id,
      main_numbers: lineNumbers.main,
      extra_numbers: lineNumbers.extra,
      perticket_numbers: lineNumbers.perticket,
      draws: 1,
      selection_type_id: rawLine.selection_type_id,
      isFree: false
    };
  }

  /**
   * Add values from obj2 to obj1 in case of equal keys
   * @param obj1, obj2
   * @returns {Object}
   */
  static extend(obj1: Object, obj2: Object): Object {
    for (const prop in obj2) {
      if (obj2[prop]) {
        Object.assign(obj1[prop] || (obj1[prop] = {}), obj2[prop]);
      }
    }

    return obj1;
  }
}
