import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { REQUEST } from '@nguniversal/express-engine/tokens';

import { RequestQueryService } from './request-query.service';

describe('RequestQueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RequestQueryService,
      ]
    });
  });

  describe('getHost', () => {
    it('should return a value on server platform', () => {
      TestBed.configureTestingModule({
        providers: [
          {provide: PLATFORM_ID, useValue: 'server'},
          {provide: DOCUMENT, useValue: {}},
          {provide: REQUEST, useValue: {get: () => 'www.domain.com'}},
        ]
      });

      const service = TestBed.get(RequestQueryService);
      expect(service.getHost()).toBe('www.domain.com');
    });

    it('should return a value on browser platform', () => {
      TestBed.configureTestingModule({
        providers: [
          {provide: PLATFORM_ID, useValue: 'browser'},
          {provide: DOCUMENT, useValue: {location: {host: 'www.domain.com'}}},
        ]
      });

      const service = TestBed.get(RequestQueryService);
      expect(service.getHost()).toBe('www.domain.com');
    });

    it('should throw an Error on server platform without request', () => {
      TestBed.configureTestingModule({
        providers: [
          {provide: PLATFORM_ID, useValue: 'server'},
          {provide: DOCUMENT, useValue: {}},
        ]
      });

      const service = TestBed.get(RequestQueryService);
      expect(() => service.getHost()).toThrowError('Request object in not set.');
    });

    it('should throw an Error on unknown platform', () => {
      TestBed.configureTestingModule({
        providers: [
          {provide: PLATFORM_ID, useValue: 'unknown'},
          {provide: DOCUMENT, useValue: {}},
        ]
      });

      const service = TestBed.get(RequestQueryService);
      expect(() => service.getHost()).toThrowError('Unknown platform.');
    });
  });

  describe('getLocationOrigin', () => {
    it('should return a value on server platform with HTTPS', () => {
      TestBed.configureTestingModule({
        providers: [
          {provide: PLATFORM_ID, useValue: 'server'},
          {provide: DOCUMENT, useValue: {}},
          {provide: REQUEST, useValue: {get: () => 'www.domain.com'}},
        ]
      });

      const service = TestBed.get(RequestQueryService);
      expect(service.getLocationOrigin()).toBe('https://www.domain.com');
    });

    it('should return a value on server platform for localhost HTTP', () => {
      TestBed.configureTestingModule({
        providers: [
          {provide: PLATFORM_ID, useValue: 'server'},
          {provide: DOCUMENT, useValue: {}},
          {provide: REQUEST, useValue: {get: () => 'localhost:5000'}},
        ]
      });

      const service = TestBed.get(RequestQueryService);
      expect(service.getLocationOrigin()).toBe('http://localhost:5000');
    });

    it('should return a value on browser platform', () => {
      TestBed.configureTestingModule({
        providers: [
          {provide: PLATFORM_ID, useValue: 'browser'},
          {provide: DOCUMENT, useValue: {location: {origin: 'https://www.domain.com'}}},
        ]
      });

      const service = TestBed.get(RequestQueryService);
      expect(service.getLocationOrigin()).toBe('https://www.domain.com');
    });

    it('should throw an Error on server platform without request', () => {
      TestBed.configureTestingModule({
        providers: [
          {provide: PLATFORM_ID, useValue: 'server'},
          {provide: DOCUMENT, useValue: {}},
        ]
      });

      const service = TestBed.get(RequestQueryService);
      expect(() => service.getLocationOrigin()).toThrowError('Request object in not set.');
    });

    it('should throw an Error on unknown platform', () => {
      TestBed.configureTestingModule({
        providers: [
          {provide: PLATFORM_ID, useValue: 'unknown'},
          {provide: DOCUMENT, useValue: {}},
        ]
      });

      const service = TestBed.get(RequestQueryService);
      expect(() => service.getLocationOrigin()).toThrowError('Unknown platform.');
    });
  });
});
