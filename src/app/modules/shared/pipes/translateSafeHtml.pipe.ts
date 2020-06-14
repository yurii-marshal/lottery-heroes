import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';

@Pipe({name: 'translateSafe'})
export class TranslateSafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer,
              private translate: TranslateService) {
  }

  transform(value: string) {
    // this.translate.onLangChange.subscribe(() => {
    //   this.parseTranslateText(value);
    // });
    return this.sanitizer.bypassSecurityTrustHtml(value);
    // return this.translate.get(value).subscribe((translateText: string) => {
    //   console.log(this.sanitizer.bypassSecurityTrustHtml(translateText));
    //   return this.sanitizer.bypassSecurityTrustHtml(translateText);
    // });
    // return value;
  }

  // parseTranslateText(val) {
  //   return this.translate.get(val).subscribe((translateText: string) => {
  //     return translateText;
  //   });
  // }
}
