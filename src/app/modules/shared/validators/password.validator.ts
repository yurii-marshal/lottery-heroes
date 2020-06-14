import { FormControl } from '@angular/forms';

export class PasswordValidator {

  public static validate(config: any) {
    return (c: FormControl) => {
      const val = c.value;
      if (val.length < config.minLength) {
        return {'passwordInvalid': true};
      }
      if (config.strongValidation === true) {
        if (val.search(/\d/) === -1 || val.search(/[a-zA-Z]/) === -1) {
          return {'passwordInvalid': true};
        }
      }
      return null;
    };
  }
}
