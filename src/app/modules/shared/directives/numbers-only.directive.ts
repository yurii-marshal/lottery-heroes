import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumbersOnly]'
})
export class NumbersOnlyDirective {

  constructor(private element: ElementRef) {
  }

  @Input() appNumbersOnly: string;

  @HostListener('keydown', ['$event'])

  onKeyDown(event) {
    const keyboardEvent = <KeyboardEvent> event;
    let regex: RegExp;

    if (this.appNumbersOnly) {

      switch (this.appNumbersOnly) {
        case 'deposit':
          regex = new RegExp(/^[0-9]+((.[0-9]{1,2})|\.)?$/);
          break;

        case 'cvv':
          regex = new RegExp(/^[0-9]{1,4}?$/);
          break;

        case 'card':
          regex = new RegExp(/^[0-9 ]+$/);
          break;

        default:
          regex = new RegExp(/^\d+$/);
      }

      const specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];

      if (specialKeys.indexOf(keyboardEvent.key) !== -1) {
        return;
      }

      const current: string = this.element.nativeElement.value ? this.element.nativeElement.value.toString() : '';
      const next: string = current.concat(keyboardEvent.key);

      if (next && !String(next).match(regex)) {
        keyboardEvent.preventDefault();
      }
    }
  }
}
