import { TestBed } from '@angular/core/testing';

import { ScripterCommandService } from '@libs/scripter/services/commands/scripter-command.service';
import { DOCUMENT } from '@angular/common';

describe('ScripterCommandService', () => {
  let service: ScripterCommandService;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScripterCommandService,
      ]
    });

    service = TestBed.get(ScripterCommandService);
    document = TestBed.get(DOCUMENT);
  });

  describe('addScript', () => {
    it('should add script', () => {
      let scriptElement;

      scriptElement = document.querySelector('body script#id-of-script-add-1');
      expect(scriptElement).toBeNull();

      service.addScript('id-of-script-add-1', '');

      scriptElement = document.querySelector('body script#id-of-script-add-1');
      expect(scriptElement).not.toBeNull();

      expect(scriptElement.getAttribute('type')).toBe('text/javascript');
      expect(scriptElement.innerHTML).toBe('');
    });

    it('should add script with special type and serialize value', () => {
      service.addScript('id-of-script-add-2', {dataOne: 1, dataTwo: 2}, 'body', 'application/ld+json');
      const scriptElement = document.querySelector('body script#id-of-script-add-2');
      expect(scriptElement.getAttribute('type')).toBe('application/ld+json');
      expect(scriptElement.innerHTML).toBe('{"dataOne":1,"dataTwo":2}');
    });

    it('should add script in head', () => {
      service.addScript('id-of-script-add-3', '', 'head');
      const scriptElement = document.querySelector('head script#id-of-script-add-3');
      expect(scriptElement).not.toBeNull();
    });
  });

  describe('removeScript', () => {
    it('', () => {
      let scriptElement;

      service.removeScript('id-of-script-remove');

      service.addScript('id-of-script-remove', '');

      scriptElement = document.querySelector('script#id-of-script-remove');
      expect(scriptElement).not.toBeNull();

      service.removeScript('id-of-script-remove');

      scriptElement = document.querySelector('script#id-of-script-remove');
      expect(scriptElement).toBeNull();
    });
  });
});
