import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { TransferState } from '@angular/platform-browser';
import * as fs from 'fs';

export class TranslateServerLoader implements TranslateLoader {
  constructor(private state: TransferState,
              private prefix: string = 'dist/browser/assets/i18n',
              private suffix: string = '.json') {
  }

  getTranslation(lang: string): Observable<any> {
    return Observable.create(observer => {
      const translations = JSON.parse(fs.readFileSync(`${process.cwd()}/${this.prefix}/${lang}${this.suffix}`, 'utf8'));

      observer.next(translations);
      observer.complete();
    });
  }

  preload(lang: string): Observable<any> {
    return this.getTranslation(lang);
  }
}
