import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type WebStorageType = 'localStorage' | 'sessionStorage';

@Injectable()
export class WebStorageService {
  private storage: Storage;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  private static serialize(data: any): string {
    return JSON.stringify(data);
  }

  private static unserialize(data: any): string {
    let storagedata;
    try {
      storagedata = JSON.parse(data);
    } catch (err) {
      storagedata = data;
    }
    return storagedata;
  }

  private init(webStorageType: WebStorageType): void {
    switch (webStorageType) {
      case 'localStorage':
        this.storage = localStorage;
        break;
      case 'sessionStorage':
        this.storage = sessionStorage;
        break;
    }
  }

  setItem(key: string, data: any, webStorageType: WebStorageType = 'localStorage'): void {
    if (isPlatformBrowser(this.platformId)) {
      this.init(webStorageType);
      const serializedData = WebStorageService.serialize(data);
      this.storage.setItem(key, serializedData);
    }
  }

  getItem(key: string, webStorageType: WebStorageType = 'localStorage'): any {
    if (isPlatformBrowser(this.platformId)) {
      this.init(webStorageType);
      const data = this.storage.getItem(key);
      return WebStorageService.unserialize(data);
    } else {
      return null;
    }
  }

  deleteItem(key: string, webStorageType: WebStorageType = 'localStorage'): void {
    if (isPlatformBrowser(this.platformId)) {
      this.init(webStorageType);
      this.storage.removeItem(key);
    }
  }

  clear(webStorageType: WebStorageType = 'localStorage'): void {
    if (isPlatformBrowser(this.platformId)) {
      this.init(webStorageType);
      this.storage.clear();
    }
  }
}
