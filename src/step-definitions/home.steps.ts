import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/custom-world';

Given('I open the nopCommerce homepage', async function (this: CustomWorld) {
  await this.homePage!.open();
  await this.homePage!.waitForFeaturedProducts();
});

Then('I should see "ADD TO CART" buttons for each featured product', async function (this: CustomWorld) {
  const count = await this.homePage!.getAddToCartButtonCount();
  console.log(`\n========================================`);
  console.log(`  Total "ADD TO CART" buttons found: ${count}`);
  console.log(`========================================\n`);
});

Then('the total number of "ADD TO CART" buttons should be greater than {int}', async function (this: CustomWorld, intValue: number) {
  const count = await this.homePage!.getAddToCartButtonCount();
  expect(count).toBeGreaterThan(intValue);
});

Then('I should see a list of featured product names', async function (this: CustomWorld) {
  const products = await this.homePage!.getFeaturedProductNames();
  console.log(`\n── Featured Products ──`);
  products.forEach((name, i) => console.log(`  ${i + 1}. ${name}`));
  console.log('');
  products.forEach((name) => expect(name).not.toBe(''));
});

Then('the number of products should be greater than {int}', async function (this: CustomWorld, intValue: number) {
  const products = await this.homePage!.getFeaturedProductNames();
  expect(products.length).toBeGreaterThan(intValue);
});

Then('the product count should match the "ADD TO CART" button count', async function (this: CustomWorld) {
  const productCount = await this.homePage!.getElementCount(this.homePage!.productItems);
  const buttonCount = await this.homePage!.getAddToCartButtonCount();
  console.log(`  Products: ${productCount} | ADD TO CART buttons: ${buttonCount}`);
  expect(buttonCount).toBe(productCount);
});

Then('I should see product details including name, price, and cart button', async function (this: CustomWorld) {
  const products = await this.homePage!.getFeaturedProductDetails();
  console.log(`\n── Product Details ──`);
  products.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.name} — ${p.price} (Cart: ${p.hasAddToCart ? '✓' : '✗'})`);
  });
  console.log('');
  expect(products.length).toBeGreaterThan(0);
  products.forEach((p) => {
    expect(p.name).not.toBe('');
    expect(p.price).not.toBe('');
    expect(p.hasAddToCart).toBe(true);
  });
});
