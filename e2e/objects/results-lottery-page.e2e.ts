import { browser } from 'protractor';

export class ResultsLotteryPage {
  open(lotteryId: string) {
    return browser.get(`/${lotteryId}/results`);
  }
}
