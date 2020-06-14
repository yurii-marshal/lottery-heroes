import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { makeStateKey, TransferState } from '@angular/platform-browser';

export class TranslateHttpLoader implements TranslateLoader {
  private translations = {};

  constructor(private http: HttpClient,
              private state: TransferState,
              private prefix: string = './assets/i18n/',
              private suffix: string = '.json') {
  }

  getTranslation(lang: string): Observable<any> {
    const key = makeStateKey(lang);
    if (this.state.hasKey(key)) {
      this.translations[lang] = this.state.get(key, undefined);
      this.state.remove(key);
    }

    if (typeof this.translations[lang] !== 'undefined') {
      return of(this.translations[lang]);
    } else {
      return this.http.get(`${this.prefix}${lang}${this.suffix}`)
        .do((translation) => this.translations[lang] = translation);
    }
  }

  preload(lang: string): Observable<any> {
    return this.getTranslation(lang);
  }
}
