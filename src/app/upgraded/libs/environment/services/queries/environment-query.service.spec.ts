import { TestBed } from '@angular/core/testing';

import { ENVIRONMENT } from '../../tokens/environment.token';
import { EnvironmentQueryService } from './environment-query.service';

describe('EnvironmentQueryService', () => {
  let service: EnvironmentQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: ENVIRONMENT, useValue: {key: 'value'}},
        EnvironmentQueryService,
      ]
    });

    service = TestBed.get(EnvironmentQueryService);
  });

  describe('getValue', () => {
    it('should return a value from environment', () => {
      expect(service.getValue('key', 'defaultValue')).toBe('value');
    });

    it('should return default value if no key in environment', () => {
      expect(service.getValue('noKey', 'defaultValue')).toBe('defaultValue');
    });

    it('should return a value from environment without second default param', () => {
      expect(service.getValue('key')).toBe('value');
    });

    it('should return undefined if no key in environment and no default param', () => {
      expect(service.getValue('noKey')).toBeUndefined();
    });
  });
});
