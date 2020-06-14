import { browser } from 'protractor';

export class ResultsDrawPage {
  /**
   * @param {string} lotteryId
   * @param {string} dateLocal example: 2018-04-11
   */
  open(lotteryId: string, dateLocal: string) {
    return browser.get(`/${lotteryId}/results/${dateLocal}`);
  }
}
