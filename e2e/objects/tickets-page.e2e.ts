import { browser } from 'protractor';

export class TicketsPage {
  open(lotteryId: string) {
    return browser.get(`/${lotteryId}`);
  }
}
