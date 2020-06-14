import { element, by } from 'protractor';
import { CartPage } from '../objects/cart-page.e2e';
import { HomePage } from '../objects/home-page.e2e';

describe('hotjar', () => {
  const hotjarId = 'hotjar-tracking-code';

  it('should add one hotjar code in head', () => {
    const homePage = new HomePage();
    const cartPage = new CartPage();

    homePage.open();
    cartPage.navigateTo();

    expect(element.all(by.id(hotjarId)).count()).toBe(1);
    expect(element(by.css(`head > script#${hotjarId}`)).isPresent()).toBe(true);
  });
});
