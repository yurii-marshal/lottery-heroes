import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class BrandTranslateService {
  private defaultResponseErrorKey = 'DEFAULT$_ERROR_FIELD';

  constructor(private translate: TranslateService) {}

  // return code_property else code else defaultRes
  getErrorMsg(code: string, property: string = '') {
    let translation = '';
    const key = code + '_' + property;
    this.translate.get('ERRORS.' + key).subscribe((res: string) => {
      if ('ERRORS.' + key !== res) {
        translation = res;
      } else {
        this.translate.get('ERRORS.' + code).subscribe((codeRes: string) => {
          if ('ERRORS.' + code !== codeRes) {
            translation = codeRes;
          } else {
            this.translate.get('ERRORS.' + this.defaultResponseErrorKey).subscribe((defaultRes: string) => {
              translation = defaultRes;
            });
          }
        });
      }
    });
    return translation;
  }

  createErrorObj(errorResponse, defaultErrorField) {
    const errorObj = {};
    if (errorResponse && errorResponse.details) {
      if (Array.isArray(errorResponse.details)) {
        errorResponse.details.forEach((error) => {
          const nameField = error.property;
          errorObj[nameField] = Object.assign(error,
            {message: this.getErrorMsg(error.code, error.property)});
        });
      } else {
        const nameField = errorResponse.details.property;
        errorObj[nameField] = Object.assign(errorResponse.details,
          {message: this.getErrorMsg(errorResponse.details.code, errorResponse.details.property)});
      }
    } else {
      errorObj[defaultErrorField] = errorResponse;
    }
    return errorObj;
  }

}
