import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class MygamesService {

  sortTable$: EventEmitter<any> = new EventEmitter();
  constructor() { }

  getSortTableEvent() {
    return this.sortTable$;
  }
}
