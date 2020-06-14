import { element, by } from 'protractor';

import { HomePage } from '../objects/home-page.e2e';
import { CartPage } from '../objects/cart-page.e2e';
import { LotteriesPage } from '../objects/lotteries-page.e2e';
import { TicketsPage } from '../objects/tickets-page.e2e';
import { ResultsPage } from '../objects/results-page.e2e';
import { ResultsLotteryPage } from '../objects/results-lottery-page.e2e';
import { ResultsDrawPage } from '../objects/results-draw-page.e2e';

describe('schema', () => {
  it('should add one website info schema', () => {
    const schemaId = 'website-info-schema';
    const homePage = new HomePage();
    const cartPage = new CartPage();

    homePage.open();
    cartPage.navigateTo();

    expect(element.all(by.id(schemaId)).count()).toBe(1);
    expect(element(by.css(`body > script#${schemaId}`)).isPresent()).toBe(true);
  });

  it('should add home info schema', () => {
    const schemaId = 'home-info-schema';
    const homePage = new HomePage();
    const cartPage = new CartPage();

    cartPage.open();
    expect(element(by.css(`body > script#${schemaId}`)).isPresent()).toBe(false);

    homePage.open();
    expect(element.all(by.id(schemaId)).count()).toBe(1);
    expect(element(by.css(`body > script#${schemaId}`)).isPresent()).toBe(true);

    cartPage.navigateTo();
    expect(element(by.css(`body > script#${schemaId}`)).isPresent()).toBe(false);
  });

  it('should add lotteries breadcrumbs schema', () => {
    const schemaId = 'lotteries-schema';
    const homePage = new HomePage();
    const lotteriesPage = new LotteriesPage();

    homePage.open();
    expect(element(by.css(`body > script#${schemaId}`)).isPresent()).toBe(false);

    lotteriesPage.open();
    expect(element.all(by.id(schemaId)).count()).toBe(1);
    expect(element(by.css(`body > script#${schemaId}`)).isPresent()).toBe(true);

    homePage.navigateTo();
    expect(element(by.css(`body > script#${schemaId}`)).isPresent()).toBe(false);
  });

  it('should add tickets breadcrumbs schema', () => {
    const schemaId = 'lottery-tickets-schema';
    const homePage = new HomePage();
    const ticketsPage = new TicketsPage();

    homePage.open();
    expect(element(by.css(`body > script#${schemaId}`)).isPresent()).toBe(false);

    ticketsPage.open('powerball');
    expect(element.all(by.id(schemaId)).count()).toBe(1);
    expect(element(by.css(`body > script#${schemaId}`)).isPresent()).toBe(true);

    homePage.navigateTo();
    expect(element(by.css(`body > script#${schemaId}`)).isPresent()).toBe(false);
  });

  it('should add results breadcrumbs schema', () => {
    const schemaId = 'lottery-results-schema';
    const homePage = new HomePage();
    const resultsPage = new ResultsPage();

    homePage.open();
    expect(element(by.css(`body > script#${schemaId}`)).isPresent()).toBe(false);

    resultsPage.open();
    expect(element.all(by.id(schemaId)).count()).toBe(1);
    expect(element(by.css(`body > script#${schemaId}`)).isPresent()).toBe(true);

    homePage.navigateTo();
    expect(element(by.css(`body > script#${schemaId}`)).isPresent()).toBe(false);
  });

  it('should add results lottery breadcrumbs schema', () => {
    const schemaId = 'results-per-lottery-schema';
    const homePage = new HomePage();
    const resultsLotteryPage = new ResultsLotteryPage();

    homePage.open();
    expect(element(by.css(`body > script#${schemaId}`)).isPresent()).toBe(false);

    resultsLotteryPage.open('powerball');
    expect(element.all(by.id(schemaId)).count()).toBe(1);
    expect(element(by.css(`body > script#${schemaId}`)).isPresent()).toBe(true);

    homePage.navigateTo();
    expect(element(by.css(`body > script#${schemaId}`)).isPresent()).toBe(false);
  });

  it('should add results draw breadcrumbs schema', () => {
    const schemaId = 'results-per-draw-schema';
    const homePage = new HomePage();
    const resultsDrawPage = new ResultsDrawPage();

    homePage.open();
    expect(element(by.css(`body > script#${schemaId}`)).isPresent()).toBe(false);

    resultsDrawPage.open('powerball', '2018-04-11');
    expect(element.all(by.id(schemaId)).count()).toBe(1);
    expect(element(by.css(`body > script#${schemaId}`)).isPresent()).toBe(true);

    homePage.navigateTo();
    expect(element(by.css(`body > script#${schemaId}`)).isPresent()).toBe(false);
  });
});
