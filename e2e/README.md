# HELP

## Locators
let elem = element(by.css('.nested-class'));
let elem = element(by.id('nested-id'));

element.all(by.className('fancy-button')).get(0).click();
element.all(by.className('fancy-button')).each(function (button) {
  // do something with button
});

## Actions
- elem.sendKeys: Type something in an input.
- elem.click: Click.
- elem.clear: Erase everything in an input.
- elem.getAttribute(‘attrName’): Return a specific attribute of the element.
- elem.submit: Submit a form.
- elem.isPresent: Test if the element is present.

## Async
browser.wait(() => browser.isElementPresent(by.css('.dynamic-text')), 5000);
expect(elem.isPresent()).toBeTruthy();
