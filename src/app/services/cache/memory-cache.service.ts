import { Injectable } from '@angular/core';

@Injectable()
export class MemoryCacheService {
  private cache: {[key: string]: any} = {};

  /**
   * Cache tag valid only 1 hour
   */
  private static tagKey(key: string): string {
    const date = new Date(),
      year = date.getFullYear(),
      monthIndex = date.getMonth(),
      day = date.getDate(),
      hours = date.getHours();

    return `${key}_${year}:${monthIndex}:${day}:${hours}`;
  }

  hasData(key: string): boolean {
    return typeof this.cache[MemoryCacheService.tagKey(key)] !== 'undefined';
  }

  setData(key: string, data: any): void {
    this.cache[MemoryCacheService.tagKey(key)] = data;
  }

  getData(key: string): any {
    return this.cache[MemoryCacheService.tagKey(key)];
  }

  deleteData(key: string): void {
    delete this.cache[MemoryCacheService.tagKey(key)];
  }

  clearAllData(): void {
    this.cache = {};
  }
}
