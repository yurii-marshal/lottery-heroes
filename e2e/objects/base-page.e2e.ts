import { browser, by, element } from 'protractor';

export abstract class BasePage {
  abstract url: string;

  open() {
    return browser.get(this.url);
  }

  navigateTo() {
    return element.all(by.css(`[href='${this.url}']`)).last().click();
  }

  getTitle() {
    return browser.getTitle();
  }
}
