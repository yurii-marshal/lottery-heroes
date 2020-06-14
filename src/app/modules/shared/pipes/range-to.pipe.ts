import { Pipe, PipeTransform } from '@angular/core';

/**
 * Create array of numbers
 * use in 'ngFor' loops
 * Example: [2,3,4,5,6]
 * *ngFor="let num of 2|rangeTo:6"
 */
@Pipe({name: 'rangeTo'})
export class RangeToPipe implements PipeTransform {
  transform(from: number, to: number): Array<number> {
    const arr = [];
    for (let i = from; i <= to; i++) {
      arr.push(i);
    }
    return arr;
  }
}
